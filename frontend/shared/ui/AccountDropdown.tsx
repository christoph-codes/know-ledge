import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Bookmark, CircleUser, LogOutIcon } from "lucide-react";

export const UserDropdown = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/*<Button variant="outline">Open</Button>*/}
          <div className={"flex items-center justify-center gap-2"}>
            <CircleUser size={35} />
            <p className={"text-xl"}>Mike</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bookmark /> Your Shared Resources
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href={"http://localhost:3000/api/auth/logout"}
                className={"flex items-center gap-2"}
              >
                <LogOutIcon /> Log out
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
