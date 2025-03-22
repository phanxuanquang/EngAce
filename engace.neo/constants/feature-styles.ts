type ColorStyle = {
  gradient: string;
  text: string;
  glow: string;
  hover: string;
  icon: string;
  stats: string;
  button: string;
};

type FeatureStyles = {
  [key: number]: ColorStyle;
};

export const featureStyles: FeatureStyles = {
  0: {
    gradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    text: "text-blue-500",
    glow: "bg-blue-500/20",
    hover: "group-hover:from-blue-500 group-hover:to-blue-600",
    icon: "from-blue-500/20 to-blue-500/10 text-blue-500",
    stats: "bg-blue-500/20",
    button: "hover:bg-blue-500"
  },
  1: {
    gradient: "bg-gradient-to-br from-green-500/20 to-green-500/10",
    text: "text-green-500",
    glow: "bg-green-500/20",
    hover: "group-hover:from-green-500 group-hover:to-green-600",
    icon: "from-green-500/20 to-green-500/10 text-green-500",
    stats: "bg-green-500/20",
    button: "hover:bg-green-500"
  },
  2: {
    gradient: "bg-gradient-to-br from-purple-500/20 to-purple-500/10",
    text: "text-purple-500",
    glow: "bg-purple-500/20",
    hover: "group-hover:from-purple-500 group-hover:to-purple-600",
    icon: "from-purple-500/20 to-purple-500/10 text-purple-500",
    stats: "bg-purple-500/20",
    button: "hover:bg-purple-500"
  },
  3: {
    gradient: "bg-gradient-to-br from-orange-500/20 to-orange-500/10",
    text: "text-orange-500",
    glow: "bg-orange-500/20",
    hover: "group-hover:from-orange-500 group-hover:to-orange-600",
    icon: "from-orange-500/20 to-orange-500/10 text-orange-500",
    stats: "bg-orange-500/20",
    button: "hover:bg-orange-500"
  }
};