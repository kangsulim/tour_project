import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, // 기존 Grid 사용
  CircularProgress,
  Alert
} from '@mui/material';
import { useLocation } from '../../context/LocationContext';
import { fetchWeatherForecast } from '../../services/weatherApi';
import { DailyWeather } from '../../types/weatherTypes';

const WeatherForecast: React.FC = () => {
  const { locationData } = useLocation();
  const [weatherData, setWeatherData] = useState<DailyWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locationData) {
      loadWeatherData(locationData.lat, locationData.lng);
    }
  }, [locationData]);

  const loadWeatherData = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const forecast = await fetchWeatherForecast(lat, lng);
      setWeatherData(forecast);
    } catch (err) {
      setError('날씨 정보를 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '내일';
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const getWeatherEmoji = (weatherMain: string) => {
    const weatherEmojis: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
    };
    return weatherEmojis[weatherMain] || '🌤️';
  };

  if (!locationData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          지도에서 위치를 선택하면 날씨 정보를 확인할 수 있습니다
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          날씨 정보를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🌤️ {locationData.placeName || '선택한 위치'}의 5일 날씨 예보
      </Typography>
      
      {/* 기존 Grid 사용 - md 값을 정수로 변경 */}
      <Grid container spacing={2}>
        {weatherData.map((day, index) => (
          <Grid item xs={12} sm={6} md={2} key={day.date}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                },
                border: index === 0 ? '2px solid #1976d2' : '1px solid #e0e0e0'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1, 
                    fontSize: '1rem',
                    fontWeight: index === 0 ? 'bold' : 'normal',
                    color: index === 0 ? '#1976d2' : 'inherit'
                  }}
                >
                  {formatDate(day.date)}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={getWeatherIcon(day.weather.icon)} 
                    alt={day.weather.description}
                    style={{ width: 60, height: 60 }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  {getWeatherEmoji(day.weather.main)} {day.weather.description}
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  <span style={{ color: '#d32f2f' }}>{day.temp_max}°</span>
                  <span style={{ color: '#1976d2', marginLeft: 8 }}>{day.temp_min}°</span>
                </Typography>
                
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  <Typography variant="caption" display="block">
                    💧 습도: {day.humidity}%
                  </Typography>
                  <Typography variant="caption" display="block">
                    ☔ 강수: {day.pop}%
                  </Typography>
                  <Typography variant="caption" display="block">
                    💨 바람: {day.wind_speed}m/s
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {weatherData.length > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 2, 
            color: 'text.secondary' 
          }}
        >
          * 날씨 정보는 OpenWeatherMap에서 제공됩니다
        </Typography>
      )}
    </Box>
  );
};

export default WeatherForecast;