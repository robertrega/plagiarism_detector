import React from "react";
import {FileItem} from "../file/file.utils";

export interface FolderItem {
    type: string,
    name: string,
    children: (FolderItem| FileItem)[]
}
