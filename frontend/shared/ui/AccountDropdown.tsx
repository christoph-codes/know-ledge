import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Bookmark, CircleUser } from "lucide-react";
import { getCurrentUser } from "@/shared/server/auth";
import { RESPONSE_STATUS } from "@know-ledge/shared";
import { LogoutButton } from "./LogoutButton";

/**
 * LEARNING: Server Component that displays user info
 * Uses getCurrentUser() to fetch authenticated user server-side
 */
export const UserDropdown = async () => {
  const result = await getCurrentUser();
  const name =
    result.status === RESPONSE_STATUS.SUCCESS && result.data
      ? result.data.name
      : "Guest";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={"flex items-center justify-center gap-2 cursor-pointer"}
        >
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
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
