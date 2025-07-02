import { Box, Container, Typography } from "@mui/material";
import MapSearch from "../Tours/MapSearch";
import WeatherForecast from "../Tours/WeatherForecast";
import Plan from "../Tours/Plan";

export default function Tour() {
  return (
      <Box sx={{
        minHeight: "calc(100vh - 80px)",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        width: "100%",
        flex: 1,
      }}>
        <Container sx={{
          width: "70%",
          height: "15vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "left",
          backgroundImage: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          textAlign: "left",
          borderRadius: "10px",
          marginTop: 4,
          marginBottom: 4,
          padding: 2,
          color: "#fff",
        }}>
          <Container sx={{
            padding: 2,
            lineHeight: 1.5,
          }}>
            <Typography variant="h3" fontWeight={"normal"}>✈️ 나만의 여행 계획</Typography>
            <Typography variant="h6" fontWeight={"light"}>완벽한 여행을 위한 스마트한 계획을 세워보세요</Typography> 
          </Container>
        </Container>
        
        <Box>
          <Box>
            <Box sx={{
              padding: 2,
              width: "1000px",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginBottom: 4,
              overflow: "hidden",
            }}>
              <MapSearch />
              
              <Plan />
            </Box>
            <Box>
              
            </Box>
            
            <Box sx={{
              padding: 2,
              width: "1000px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginBottom: 4,
            }}>
              <WeatherForecast />
            </Box>
          </Box>
        </Box>
      </Box>
  );
}