import { useEffect, useState } from "react";
import styles from "./SessionNote.module.css";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  updateSessionNote,
  toggleSessionStatus,
} from "@src/store/reducers/Attendance/Session Note/SessionNoteSlice";
import { ToastError, ToastSuccess } from "@src/util/Toast";
import CheckBox from "../Inputs/CheckBox";
import {
  fetchAttendance,
  fetchAttendanceTrainer,
} from "@src/store/reducers/Attendance/AttendanceSlice";

const SessionNotes = ({ row, class_id, type }) => {
  const [read_only, setReadOnly] = useState(true);

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.SessionNote);

  const updateSessionNoteForCheckbox = (updateSession) => {
    dispatch(updateSessionNote(updateSession))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        type === "trainer_attendance" && dispatch(fetchAttendanceTrainer());
        type === "attendance" && dispatch(fetchAttendance({ class_id }));
      });
  };

  const toggleSessionUpdate = (session_id) => {
    dispatch(toggleSessionStatus({ session_id }))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        type === "trainer_attendance" && dispatch(fetchAttendanceTrainer());
        type === "attendance" && dispatch(fetchAttendance({ class_id }));
      });
  };

  useEffect(() => {
    if (error) {
      ToastError(error.message);
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  return (
    <div className={styles.SessionNotes}>
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {row.session_notes?.map((session) => (
          <div className={styles.session_list} key={session.id}>
            <CheckBox
              id={`session-checkbox-${session.id}`}
              label=""
              defaultChecked={session.session_status === 0 ? false : true}
              className={styles.list_checkbox}
              handlePermissionChange={(e, v) =>
                toggleSessionUpdate(session.id)
              }
            />
            <input
              defaultValue={session.session_title}
              readOnly={read_only}
              onDoubleClick={() => setReadOnly(false)}
              onBlur={(e) => {
                updateSessionNoteForCheckbox({
                  session_id: session.id,
                  session_title: e.target.value,
                });

                setReadOnly(true);
              }}
              className={read_only ? "" : styles.foucs}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

SessionNotes.propTypes = {
  row: propTypes.object.isRequired,
  class_id: propTypes.number,
  type: propTypes.string,
};

export default SessionNotes;
