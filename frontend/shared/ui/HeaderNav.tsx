import { ShareResource } from "@/features/resources/ui/ShareResource";
import { CompanyLogo } from "@/shared/ui/CompanyLogo";
import { UserDropdown } from "@/shared/ui/AccountDropdown";
import { Button } from "@/shared/ui/button";

export const HeaderNav = () => (
  <div
    className={"mb-20 h-20 border-b border-b-gray-300 bg-white drop-shadow-md"}
  >

    <div className={"flex h-full flex-row items-center gap-2 pl-12"}>
      <CompanyLogo />

      <p className={"text-2xl font-bold"}>Method Know</p>

      <div className={"ml-auto pr-12"}>
        <div className={"justify-betweenx flex gap-4"}>
          <ShareResource
            isEditMode={false}
            triggerElement={
              <Button className={"w-44 px-4 py-2"}>Share Resource</Button>
            }
          />

          <div className={"flex items-center justify-center gap-2"}>
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  </div>
);
