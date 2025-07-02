import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  LocationOn, 
  AccessTime, 
  Edit, 
  Delete, 
  Add,
  Save,
  Visibility,
  PictureAsPdf 
} from '@mui/icons-material';
import { useLocation } from '../../context/LocationContext';

// 타입 정의
interface Place {
  id: number;
  time: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface ScheduleDay {
  day: number;
  date: string;
  places: Place[];
}

interface NewPlaceForm {
  time: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

const Schedule: React.FC = () => {
  // LocationContext에서 지도 데이터 가져오기
  const { locationData } = useLocation();

  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);

  const [currentDay, setCurrentDay] = useState<number>(0);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [newPlace, setNewPlace] = useState<NewPlaceForm>({
    time: '',
    name: '',
    address: '',
    lat: null,
    lng: null
  });

  // MapSearch에서 선택한 장소를 일정에 추가
  const addPlaceFromMap = (): void => {
    if (locationData) {
      // 일정이 없으면 먼저 일정을 추가하라고 안내
      if (scheduleData.length === 0) {
        alert('먼저 일정을 추가해주세요.');
        return;
      }
      
      setNewPlace({
        time: '', // 사용자가 입력
        name: locationData.placeName || '',
        address: locationData.placeAddress || '',
        lat: locationData.lat,
        lng: locationData.lng
      });
      setOpenAddDialog(true);
    } else {
      alert('먼저 지도에서 장소를 선택해주세요.');
    }
  };

  // 장소 추가 확정
  const confirmAddPlace = (): void => {
    if (!newPlace.name || !newPlace.time) {
      alert('시간과 장소명을 입력해주세요.');
      return;
    }

    if (newPlace.lat === null || newPlace.lng === null) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const updatedSchedule: ScheduleDay[] = [...scheduleData];
    const newPlaceWithId: Place = {
      ...newPlace,
      id: Date.now(),
      lat: newPlace.lat,
      lng: newPlace.lng
    };
    
    updatedSchedule[currentDay].places.push(newPlaceWithId);
    
    // 시간순으로 정렬
    updatedSchedule[currentDay].places.sort((a: Place, b: Place) => 
      a.time.localeCompare(b.time)
    );
    
    setScheduleData(updatedSchedule);
    setOpenAddDialog(false);
    resetNewPlace();
  };

  // 장소 수정
  const editPlace = (place: Place): void => {
    setSelectedPlace(place);
    setNewPlace({
      time: place.time,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng
    });
    setOpenEditDialog(true);
  };

  // 장소 수정 확정
  const confirmEditPlace = (): void => {
    if (!selectedPlace || !newPlace.name || !newPlace.time) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    if (newPlace.lat === null || newPlace.lng === null) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const updatedSchedule: ScheduleDay[] = [...scheduleData];
    const placeIndex: number = updatedSchedule[currentDay].places.findIndex(
      (place: Place) => place.id === selectedPlace.id
    );
    
    if (placeIndex !== -1) {
      updatedSchedule[currentDay].places[placeIndex] = {
        ...selectedPlace,
        time: newPlace.time,
        name: newPlace.name,
        address: newPlace.address,
        lat: newPlace.lat,
        lng: newPlace.lng
      };
      
      // 시간순으로 정렬
      updatedSchedule[currentDay].places.sort((a: Place, b: Place) => 
        a.time.localeCompare(b.time)
      );
      
      setScheduleData(updatedSchedule);
    }
    
    setOpenEditDialog(false);
    setSelectedPlace(null);
    resetNewPlace();
  };

  // 장소 삭제
  const deletePlace = (placeId: number): void => {
    const updatedSchedule: ScheduleDay[] = [...scheduleData];
    updatedSchedule[currentDay].places = updatedSchedule[currentDay].places.filter(
      (place: Place) => place.id !== placeId
    );
    setScheduleData(updatedSchedule);
  };

  // 새로운 날짜 추가
  const addNewDay = (): void => {
    const today = new Date();
    const newDate = new Date(today.getTime() + (scheduleData.length * 24 * 60 * 60 * 1000));
    
    const newDay: ScheduleDay = {
      day: scheduleData.length + 1,
      date: newDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
      places: []
    };
    
    const newScheduleData = [...scheduleData, newDay];
    setScheduleData(newScheduleData);
    
    // 새로 추가된 날짜로 자동 이동
    setCurrentDay(newScheduleData.length - 1);
  };

  // 새 장소 폼 초기화
  const resetNewPlace = (): void => {
    setNewPlace({
      time: '',
      name: '',
      address: '',
      lat: null,
      lng: null
    });
  };

  // 탭 변경 핸들러
  const handleTabChange = (_: React.SyntheticEvent, newValue: number): void => {
    setCurrentDay(newValue);
  };

  // 다이얼로그 닫기 핸들러
  const handleCloseAddDialog = (): void => {
    setOpenAddDialog(false);
    resetNewPlace();
  };

  const handleCloseEditDialog = (): void => {
    setOpenEditDialog(false);
    setSelectedPlace(null);
    resetNewPlace();
  };

  // 입력 핸들러들
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPlace({ ...newPlace, time: event.target.value });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPlace({ ...newPlace, name: event.target.value });
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPlace({ ...newPlace, address: event.target.value });
  };

  const currentSchedule: ScheduleDay | undefined = scheduleData[currentDay];

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          📅 일정 관리
        </Typography>
        {scheduleData.length > 0 && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={addPlaceFromMap}
            sx={{ borderRadius: 2 }}
          >
            장소 추가
          </Button>
        )}
      </Box>

      {/* 날짜 탭 */}
      {scheduleData.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={currentDay} 
            onChange={handleTabChange}
            sx={{ mb: 2 }}
          >
            {scheduleData.map((day: ScheduleDay) => (
              <Tab 
                key={day.day} 
                label={`${day.day}일차 (${day.date})`}
                sx={{ 
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    color: '#1976d2'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}
      
      {/* 일정 추가 버튼 - 항상 표시 */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={addNewDay}
          sx={{ 
            borderStyle: 'dashed',
            color: '#1976d2',
            borderColor: '#1976d2'
          }}
        >
          일정 추가
        </Button>
      </Box>

      {/* 일정 내용 */}
      {scheduleData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {currentSchedule && currentSchedule.places.length > 0 ? (
            // 장소가 있는 경우 - 최대 5개까지만 표시하고 스크롤
            <Box
              sx={{
                maxHeight: currentSchedule.places.length > 5 ? '400px' : 'auto',
                overflowY: currentSchedule.places.length > 5 ? 'auto' : 'visible',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#a1a1a1',
                  },
                },
              }}
            >
              {currentSchedule.places.map((place: Place) => (
                <Card 
                  key={place.id} 
                  sx={{ 
                    mb: 2, 
                    boxShadow: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Chip 
                          icon={<AccessTime />}
                          label={place.time}
                          color="primary"
                          size="small"
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {place.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {place.address}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => editPlace(place)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deletePlace(place.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // 현재 날짜에 장소가 없는 경우
            <Card sx={{ 
              textAlign: 'center', 
              py: 6, 
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ddd'
            }}>
              <CardContent>
                <Typography variant="h1" sx={{ mb: 2 }}>📍</Typography>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  이 날짜에 장소를 추가해보세요
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  지도에서 선택하거나 검색으로 추가할 수 있습니다
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* 액션 버튼 - 일정이 있을 때만 표시 */}
      {scheduleData.length > 0 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Save />}>
              임시저장
            </Button>
            <Button variant="outlined" startIcon={<Visibility />}>
              미리보기
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              startIcon={<PictureAsPdf />}
              sx={{ backgroundColor: '#4caf50' }}
            >
              📄 PDF 저장
            </Button>
            <Button variant="contained" color="primary">
              여행 완료
            </Button>
          </Box>
        </Box>
      )}

      {/* 장소 추가 다이얼로그 */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>새 장소 추가</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="시간"
              type="time"
              value={newPlace.time}
              onChange={handleTimeChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="장소명"
              value={newPlace.name}
              onChange={handleNameChange}
              fullWidth
              disabled
            />
            <TextField
              label="주소"
              value={newPlace.address}
              onChange={handleAddressChange}
              fullWidth
              multiline
              rows={2}
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>취소</Button>
          <Button onClick={confirmAddPlace} variant="contained">추가</Button>
        </DialogActions>
      </Dialog>

      {/* 장소 수정 다이얼로그 */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>장소 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="시간"
              type="time"
              value={newPlace.time}
              onChange={handleTimeChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="장소명"
              value={newPlace.name}
              onChange={handleNameChange}
              fullWidth
            />
            <TextField
              label="주소"
              value={newPlace.address}
              onChange={handleAddressChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>취소</Button>
          <Button onClick={confirmEditPlace} variant="contained">수정</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule;