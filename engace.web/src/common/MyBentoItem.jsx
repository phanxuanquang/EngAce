import { Paper, Typography, styled } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  aspectRatio: "1/1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center", 
  margin: 5,
}));

const IconWrapper = styled("div")({
  alignSelf: "center", 
  marginBottom: "8px", 
});

MyBentoItem.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};

export default function MyBentoItem({ title, route, backgroundColor, Icon }) {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(route);
  };
  return (
    <Item
      sx={{
        bgcolor: { backgroundColor },
        color: "#ffffff",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          opacity: 0.9,
          transform: "scale(1.05)",
          boxShadow: "0 0.2rem 1.2rem rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={() => handleNavigation()}
      elevation={8}
    >
      <IconWrapper>
        <Icon sx={{ width: "60%", height: "auto", margin: "0px" }} />
      </IconWrapper>
      <Typography variant="h3" sx={{ alignSelf: "center" }}>
        {title}
      </Typography>
    </Item>
  );
}
