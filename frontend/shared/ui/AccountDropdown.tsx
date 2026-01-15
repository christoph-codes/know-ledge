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
import {getCurrentUser} from "@/shared/server/auth";

export const UserDropdown = async () => {
  const result = await getCurrentUser();
  const name = result.ok && result.data ? result.data.name : "Guest" ;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/*<Button variant="outline">Open</Button>*/}
          <div className={"flex items-center justify-center gap-2"}>
            <CircleUser size={35} />
            <p className={"text-xl"}>{name}</p>
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
