import { useFormik, FormikConfig } from "formik";
import { NewSong } from "./song";

export type NewSongFormModel = NewSong;

export function useNewSongForm(config: FormikConfig<NewSongFormModel>) {
  const formik = useFormik<NewSongFormModel>(config);

  return { ...formik };
}
