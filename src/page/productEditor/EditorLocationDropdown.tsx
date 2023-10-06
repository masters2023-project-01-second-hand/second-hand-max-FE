import { Dropdown } from '../../components/dropdown/Dropdown';
import { MenuItem } from '../../components/dropdown/MenuItem';
import { extractKeyName } from '../../utils/extractKeyName';

export function EditorLocationDropdown({
  UserLocationData,
  selectLocation,
}: {
  UserLocationData: { id: number; name: string; isSelected: boolean }[];
  selectLocation: (productId: number) => void;
}) {
  const selectedUserLocation = UserLocationData.filter(
    data => data.isSelected === true
  )[0];

  return (
    <div>
      <Dropdown
        btnText={extractKeyName(selectedUserLocation?.name) ?? '역삼1동'}
        iconName="chevronDown"
        align="left"
      >
        {UserLocationData.map(location => {
          return (
            <MenuItem
              key={location.id}
              isSelected={location.isSelected}
              onAction={() => selectLocation(location.id)}
            >
              {location.name}
            </MenuItem>
          );
        })}
      </Dropdown>
    </div>
  );
}
