import { useSortContext } from "./SortContext"
import { Menu } from '@headlessui/react';

export default function SortMenuButton() {
  const sortContext = useSortContext();
  
  return (
    <Menu.Button className="text-white w-full text-right">{sortContext.sort}</Menu.Button>
  )
}
