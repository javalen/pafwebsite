import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  IconButton,
  Typography,
  Card,
} from "@material-tailwind/react";

export function ImageViewer({ url }) {
  const [open, setOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleOpen = () => setOpen((cur) => !cur);
  const handleIsFavorite = () => setIsFavorite((cur) => !cur);

  return (
    <div className=" bg-transparent ">
      <div className="grid grid-cols-1 h-64 overflow-hidden transition-opacity hover:opacity-90 bg-transparent">
        <img
          className="h-full w-full object-cover object-center cursor-pointer"
          onClick={handleOpen}
          src={url}
        />
      </div>
      <Dialog
        className="h-[42rem] overflow-scroll w-[32rem] "
        open={open}
        handler={handleOpen}
      >
        <DialogBody className="">
          <img alt="nature" className="rounded-lg" src={url} />
        </DialogBody>
      </Dialog>
    </div>
  );
}
