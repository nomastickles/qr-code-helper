import { createAction } from "@reduxjs/toolkit";
import { SetAppDataProps, SetAppStepProps, AppData } from "./types";

export const reset = createAction("reset");
export const setAppDataAll = createAction<AppData>("setAppDataAll");
export const setAppData = createAction<SetAppDataProps>("setAppData");
export const setAppStep = createAction<SetAppStepProps>("setAppStep");
