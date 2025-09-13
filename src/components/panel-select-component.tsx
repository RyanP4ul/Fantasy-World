import { SelectContent, SelectGroup, SelectItem, SelectLabel } from "./ui/select";

export function PanelSelectContent() {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Items</SelectLabel>
        <SelectItem value="items/axes">Axe</SelectItem>
        <SelectItem value="items/bows">Bow</SelectItem>
        <SelectItem value="items/capes">Cape</SelectItem>
        <SelectItem value="items/daggers">Dagger</SelectItem>
        <SelectItem value="items/gauntlet">Gauntlet</SelectItem>
        <SelectItem value="items/grounds">Ground</SelectItem>
        <SelectItem value="items/guns">Gun</SelectItem>
        <SelectItem value="items/helms">Helm</SelectItem>
        <SelectItem value="items/house">House</SelectItem>
        <SelectItem value="items/maces">Mace</SelectItem>
        <SelectItem value="items/pets">Pet</SelectItem>
        <SelectItem value="items/polearms">Polearm</SelectItem>
        <SelectItem value="items/staff">Staff</SelectItem>
        <SelectItem value="items/staves">Stave</SelectItem>
        <SelectItem value="items/swords">Sword</SelectItem>
        <SelectItem value="items/titles">Title</SelectItem>
      </SelectGroup>
      <SelectGroup className="mt-3">
        <SelectLabel>Armor</SelectLabel>
        <SelectItem value="M">Male</SelectItem>
        <SelectItem value="F">Female</SelectItem>
      </SelectGroup>
      <SelectGroup className="mt-3">
        <SelectLabel>Areas</SelectLabel>
        <SelectItem value="maps">Maps</SelectItem>
        <SelectItem value="mon">Monsters</SelectItem>
        <SelectItem value="npcs">NPCs</SelectItem>
      </SelectGroup>
      <SelectGroup className="mt-3">
        <SelectLabel>Images</SelectLabel>
        <SelectItem value="posts">Posts</SelectItem>
        <SelectItem value="achievements">Achievements</SelectItem>
      </SelectGroup>
      <SelectGroup className="mt-3">
        <SelectLabel>Others</SelectLabel>
        <SelectItem value="news/badges">Book Badges</SelectItem>
      </SelectGroup>
    </SelectContent>
  );
}