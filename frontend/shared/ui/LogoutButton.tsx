"use client";

import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "@/features/auth/auth.actions";

export function LogoutButton() {
  return (
    <DropdownMenuItem onClick={() => logoutUser()}>
      <LogOutIcon /> Log out
    </DropdownMenuItem>
  );
}
