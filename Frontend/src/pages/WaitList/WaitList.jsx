import { useEffect, useState } from "react";
import styles from "@styles/styles.module.css";
import PathName from "@src/components/Gateway-System/PathName/PathName";
import AddButton from "@src/components/Gateway-System/AddButton/AddButton";
import Modals from "@src/components/Gateway-System/Modals/Modals";
import FormTrainee from "@src/components/forms/WaitList/Trainee/FormTrainee";
import AdvancedTable from "@src/components/Gateway-System/Table/AdvancedTable";
import { CloumnsWaitList } from "@src/shared/CloumnsTables";
import ActionWaitlist from "@src/components/Gateway-System/Table/Actions/ActionWaitList";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  createWaitlist,
  fetchWaitList,
  UpdateWaitList,
  DeleteWaitList,        // ✅ جديد
  updateWaitListMeta, // ✅✅ for Meta update
  updateWaitListLevel, // ✅✅ for Level update
} from "@src/store/reducers/WaitList/WaitListSlice";
import { ToastError, ToastSuccess } from "@src/util/Toast";
import AssignClass from "@src/components/forms/WaitList/Assign Class/AssignClass";
import { Navigate, useOutletContext } from "react-router-dom";
import checkPermission from "@src/util/CheckPermission";
import { Helmet } from "react-helmet";
import { clearSelected } from "@src/store/Hook/clearSelection"; // ✅ جديد
import ConfirmDelete from "@src/components/feedback/Alert/ConfirmDelete"; // ✅ جديد

const WaitList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState({ isOpen: false });
  const [isOpenAssignClass, setIsOpenAssignClass] = useState({ isOpen: false });
  const [branch, setBranch] = useState("");

  // ✅ row المطلوب حذفه
  const [rowToDelete, setRowToDelete] = useState(null);

  const context = useOutletContext();
  const dispatch = useDispatch();
  const { waitList, error, isLoading } = useSelector((state) => state.waitList);

  useEffect(() => {
    dispatch(fetchWaitList(branch));
  }, [dispatch, branch]);

  const HandlerEdit = (value) => {
    setIsOpenEdit({ isOpen: true, trainee: value });
  };

  const onSubmitEdit = (data) => {
    dispatch(UpdateWaitList({ id: isOpenEdit?.trainee.id, data }))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchWaitList());
        setIsOpenEdit({ isOpen: false });
      });
  };

  const handleUpdateMeta = (data) => {
    dispatch(updateWaitListMeta(data))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchWaitList());
      });
  };

  const handleUpdateLevel = (data) => {
    dispatch(updateWaitListLevel(data))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchWaitList());
      });
  };

  const onSubmit = (data) => {
    dispatch(createWaitlist(data))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchWaitList());
        setIsOpen(false);
      });
  };

  // ✅ طلب الحذف جاي من ActionWaitlist
  const handleRequestDelete = (row) => {
    setRowToDelete(row);
  };

  // ✅ تنفيذ الحذف بعد تأكيد البوب أب
  const handleConfirmDelete = () => {
    if (!rowToDelete) return;

    dispatch(DeleteWaitList(rowToDelete.id))
      .unwrap()
      .then(({ message }) => {
        ToastSuccess(message);
        dispatch(fetchWaitList());
        dispatch(clearSelected());
      })
      .finally(() => {
        setRowToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    setRowToDelete(null);
  };

  // Show error message
  useEffect(() => {
    if (error) {
      ToastError(error?.message);
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  if (
    !checkPermission({
      name: "waitlist",
      children: [
        "view_trainees",
        "view_own_trainees",
        "view_trainees_by_branch",
      ],
    })
  ) {
    return <Navigate to="*" replace />;
  }

  return (
    <div className={styles.containerPage}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${context} | WaitList`}</title>
      </Helmet>

      <PathName path="Wait List" />
      <div className={styles.containerPage_content}>
        {/* 🔥 Confirm Delete Modal */}
        <ConfirmDelete
          open={!!rowToDelete}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />

        {/* Add Trainee */}
        {checkPermission({
          name: "waitlist",
          children: ["create_trainees", "create_trainees_by_branch"],
        }) && (
          <>
            <AddButton
              title="Add Trainee"
              name="Add Trainee"
              openAddModal={() => setIsOpen(true)}
            />

            <Modals isOpen={isOpen} handleClose={() => setIsOpen(false)}>
              <FormTrainee
                onSubmit={onSubmit}
                isLoading={isLoading}
                type="waitlist"
              />
            </Modals>
          </>
        )}

        {/* Assign Class */}
        <Modals
          isOpen={isOpenAssignClass.isOpen}
          handleClose={() => setIsOpenAssignClass({ isOpen: false })}
        >
          <AssignClass
            getAssignId={isOpenAssignClass?.idURL}
            closeAssignClass={() =>
              setIsOpenAssignClass({
                isOpen: false,
              })
            }
          />
        </Modals>

        {/* Edit Trainee */}
        {checkPermission({
          name: "waitlist",
          children: [
            "update_trainees",
            "update_own_trainees",
            "update_trainees_by_branch",
          ],
        }) && (
          <Modals
            isOpen={isOpenEdit.isOpen}
            handleClose={() => setIsOpenEdit({ isOpen: false })}
          >
            <FormTrainee
              onSubmit={onSubmitEdit}
              isLoading={isLoading}
              edit={true}
              trainee={isOpenEdit?.trainee}
              type="waitlist"
            />
          </Modals>
        )}

        {/* Table WaitList */}
        <div className={styles.table}>
          <AdvancedTable
            columns={CloumnsWaitList(handleUpdateMeta, handleUpdateLevel)}
            type="waitlist"
            rows={waitList?.trainees || []}
            Actions={
              <ActionWaitlist
                HandlerEdit={HandlerEdit}
                openAssginClass={(id) =>
                  setIsOpenAssignClass({
                    isOpen: true,
                    idURL: id,
                  })
                }
                onRequestDelete={handleRequestDelete} // ✅ مهم جداً
              />
            }
            isLoading={isLoading}
            enableRowSelection={true}
            enableRowActions={true}
            setBranch={setBranch}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitList;
