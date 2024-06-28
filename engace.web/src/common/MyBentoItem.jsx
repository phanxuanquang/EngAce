import { Paper, Typography, styled } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  aspectRatio: "1/1",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}));

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
      sx={{ bgcolor: { backgroundColor }, color: "black", cursor: "pointer" }}
      onClick={() => handleNavigation()}
      elevation={8}
    >
      <Typography variant="h3" sx={{ alignSelf: "start" }}>
        {title}
      </Typography>
      <Icon
        sx={{
          alignSelf: "end",
          width: "30%",
          height: "30%",
        }}
      />
    </Item>
  );
}
