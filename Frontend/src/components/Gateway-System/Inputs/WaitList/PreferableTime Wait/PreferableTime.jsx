import {
    clearError,
    createPreferableTime,
    deletePreferableTime,
    fetchPreferableTime
} from "@src/store/reducers/WaitList/View/ViewSlice";
import { ToastError, ToastSuccess } from "@src/util/Toast";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { SiCoursera } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../Select";

const PreferableTime = ({
  id,
  defaultValue,
  onChange,
  attend_type,
  age_group,
  Button,
  label,
  required,
  showRemoveButton = true,
}) => {
  const dispatch = useDispatch();

  const { preferableTime, loading, error } = useSelector(
    (state) => state.viewWaitList
  );

  useEffect(() => {
    if (age_group) {
      // Fetch preferable times filtered by age_group only
      dispatch(fetchPreferableTime(age_group));
    } else {
      // If no age_group, fetch empty list to enforce separation
      dispatch(fetchPreferableTime(null));
    }
  }, [dispatch, age_group]);

  // create a new Preferable Time with age_group
  const createNewPreferableTime = (preferable_time) => {
    if (!age_group) {
      ToastError("Age group is required to add a preferable time");
      return;
    }

    dispatch(createPreferableTime({ preferable_time, age_group }))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchPreferableTime(age_group));
      })
      .catch((error) => {
        ToastError(error.message || error || "Failed to add preferable time");
      });
  };

  // delete a preferable time
  const deletePreferableTimeHandler = (timeId) => {
    if (window.confirm("Are you sure you want to delete this preferable time?")) {
      dispatch(deletePreferableTime(timeId))
        .unwrap()
        .then(({ message }) => {
          ToastSuccess(message);
          dispatch(fetchPreferableTime(age_group));
        })
        .catch((error) => {
          ToastError(error.message || "Failed to delete preferable time");
        });
    }
  };

  useEffect(() => {
    if (error) {
      ToastError(error);
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  return (
    <Select
      id={id}
      name="Preferable Time"
      label={label || "Preferable time of slot (Optional)"}
      options={
        preferableTime?.map((time) => ({
          id: time.id,
          label: time.preferable_time || time.time_slot,
        })) || []
      }
      placeholder="Preferable time"
      Icon={<SiCoursera size={23} />}
      Button={Button}
      showRemoveButton={showRemoveButton}
      defaultValue={defaultValue}
      required={required}
      isLoading={loading}
      onSubmitNew={createNewPreferableTime}
      onDelete={deletePreferableTimeHandler}
      onChange={onChange}
    />
  );
};

PreferableTime.propTypes = {
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  attend_type: PropTypes.string,
  age_group: PropTypes.string,
  Button: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string,
  showRemoveButton: PropTypes.bool,
};

export default PreferableTime;
