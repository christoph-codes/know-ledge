import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteResource } from "@/features/resources/server/resource.action";

export type ResourceDeletePromptProps = {
  id: string;
};

export const ResourceDeletePrompt = ({ id }: ResourceDeletePromptProps) => {
  const handleDelete = async () => {
    const result = await deleteResource(id);

    if (result.ok) {
      //TODO: call toast to show success message
      console.log("Resource deleted successfully");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 size={20} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you want to delete this resource?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            resource and remove your data from our servers.
            <span className={"font-bold"}>DELETING ID: {id}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => await handleDelete()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
