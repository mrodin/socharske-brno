import { FC } from "react";
import { SearchBar } from "react-native-elements";
import { cssInterop } from "nativewind";

const StyledSearchBar = cssInterop(SearchBar, {
  containerClassName: "containerStyle",
  inputContainerClassName: "inputContainerStyle",
  inputClassName: "inputStyle",
  leftIconContainerClassName: "leftIconContainerStyle",
  rightIconContainerClassName: "rightIconContainerStyle",
});

type SearchProfileBarProps = {
  searchText: string;
  updateSearchText: (text: string) => void;
  isLoading: boolean;
};

export const SearchProfileBar: FC<SearchProfileBarProps> = ({
  searchText,
  updateSearchText,
  isLoading,
}) => {
  return (
    <StyledSearchBar
      platform="default"
      placeholder="Jméno uživatele..."
      //@ts-ignore
      onChangeText={updateSearchText}
      value={searchText}
      showLoading={isLoading}
      placeholderTextColor="#999999"
      containerClassName="border-t-0 border-b-1 border-b-gray-light bg-transparent"
      inputContainerClassName="bg-transparent border-0 rounded-full h-10"
      inputClassName="bg-transparent text-white"
      leftIconContainerClassName="hidden"
      rightIconContainerClassName="fill-white"
    />
  );
};
