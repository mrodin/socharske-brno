import { FC } from "react";
import Svg, { Path } from "react-native-svg";

export const MapIcon: FC<{ color: string }> = ({ color }) => {
  return (
    <Svg width="20" height="31" viewBox="0 0 20 31" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.591 9.59091C18.591 16.2727 10.0001 22 10.0001 22C10.0001 22 1.40918 16.2727 1.40918 9.59091C1.40918 7.31246 2.31429 5.12733 3.9254 3.51622C5.53651 1.90511 7.72164 1 10.0001 1C12.2785 1 14.4637 1.90511 16.0748 3.51622C17.6859 5.12733 18.591 7.31246 18.591 9.59091Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.99938 12.4546C11.5809 12.4546 12.863 11.1725 12.863 9.59093C12.863 8.00939 11.5809 6.72729 9.99938 6.72729C8.41784 6.72729 7.13574 8.00939 7.13574 9.59093C7.13574 11.1725 8.41784 12.4546 9.99938 12.4546Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
