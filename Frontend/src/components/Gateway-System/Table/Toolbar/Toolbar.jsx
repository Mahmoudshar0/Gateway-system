import { Box, Button, IconButton } from "@mui/material";
import { clearSelected } from "@src/store/Hook/clearSelection";
import { getBranchesAllPages } from "@src/store/reducers/Branches/BrancheSlice";
import checkPermission from "@src/util/CheckPermission";
import {
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import propTypes from "prop-types";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { BiExport } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import Branch from "../../Inputs/Branch";
import MoveBlackList from "../../Move/BlackList/MoveBlackList";
import MoveClass from "../../Move/Class/MoveClass";
import MoveHoldList from "../../Move/HoldList/MoveHoldList";
import MovePendingTest from "../../Move/PendingTest/MovePendingTest";
import MovePendingUser from "../../Move/PendingUser/MovePendingUser";
import MoveRefundList from "../../Move/RefundList/MoveRefundList";
import MoveWaitList from "../../Move/WaitList/MoveWaitList";
import styles from "./Toolbar.module.css";

const Toolbar = ({ table, type, csvData, bulkDelete, setBranch, totalCount, onRefresh }) => {
  let selected = [];
  const dispatch = useDispatch();
  const { page_branches } = useSelector((state) => state.branches);

  useEffect(() => {
    dispatch(getBranchesAllPages());
  }, [dispatch]);

  table
    .getSelectedRowModel()
    .rows.map((row) => selected.push(Number(row.original.id)));

  // bulk Delete All
  const onBulkDelete = () => {
    bulkDelete(selected);
    dispatch(clearSelected());
  };

  // Use totalCount if provided (server-side pagination), otherwise use csvData.length (client-side)
  const displayTotal = totalCount !== undefined ? totalCount : csvData.length;

  return (
    <div className={styles.Toolbar}>
      <h3>Total Rows: {displayTotal}</h3>
      <div className={styles.ToolbarWapper}>
        {selected.length ? (
          <Box component={"div"} className={styles.ToolbarButtons}>
            {type === "class" && (
              <MoveClass styles={styles.btn} selected={selected} />
            )}
            {type === "pendingUser" && (
              <MovePendingUser styles={styles.btn} selected={selected} />
            )}
            {type === "pendingTest" && (
              <MovePendingTest styles={styles.btn} selected={selected} />
            )}
            {type === "waitlist" && (
              <MoveWaitList styles={styles.btn} selected={selected} />
            )}
            {type === "refundlist" && (
              <MoveRefundList styles={styles.btn} selected={selected} />
            )}
            {type === "blacklist" && (
              <MoveBlackList styles={styles.btn} selected={selected} />
            )}
            {type === "holdlist" && (
              <MoveHoldList styles={styles.btn} selected={selected} />
            )}
            {type === "trainees" && (
              <MoveWaitList styles={styles.btn} selected={selected} onRefresh={onRefresh} />
            )}
            {type === "branches" && (
              <>
                {checkPermission({
                  name: "branches",
                  children: ["delete_branch"],
                }) && (
                    <Button
                      variant="contained"
                      className={styles.btn}
                      onClick={onBulkDelete}
                    >
                      Delete All
                    </Button>
                  )}
              </>
            )}
            {type === "users" && (
              <>
                {checkPermission({
                  name: "users",
                  children: [
                    "delete_users",
                    "delete_own_users",
                    "delete_users_by_branch",
                  ],
                }) && (
                    <Button
                      variant="contained"
                      className={styles.btn}
                      onClick={onBulkDelete}
                    >
                      Delete All
                    </Button>
                  )}
              </>
            )}
          </Box>
        ) : (
          <>
            {setBranch && (
              <>
                {checkPermission({
                  name: "users",
                  children: ["view_users", "view_own_users"],
                }) && (
                    <>
                      {page_branches?.current_branch && (
                        <div className={styles.branch}>
                          <Branch
                            label={true}
                            branches={page_branches?.branches}
                            setBranch={setBranch}
                            current_branch={""}
                            display="inline"
                            background="transparent"
                          />
                        </div>
                      )}
                    </>
                  )}
              </>
            )}
            <MRT_GlobalFilterTextField
              table={table}
              sx={{
                "& .css-1yg0dk4-MuiInputBase-root-MuiOutlinedInput-root": {
                  padding: "7px !important",
                  color: "var(--text-gray) !important",
                },
                "& .MuiOutlinedInput-root": {
                  padding: "7px !important",
                  color: "var(--text-gray) !important",
                },
              }}
            />
            <MRT_ToggleGlobalFilterButton
              table={table}
              className={styles.icon}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "30px !important",
                  color: "var(--bg-button) !important",
                },
              }}
            />
            <MRT_ShowHideColumnsButton
              table={table}
              className={styles.icon}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "30px !important",
                  color: "var(--bg-button) !important",
                },
              }}
            />
            <Button
              onClick={() => {
                table.resetColumnFilters();
                table.resetGlobalFilter();
                table.resetSorting();
              }}
              variant="outlined"
              size="small"
              title="Clear All Filters"
              sx={{
                color: "var(--bg-button)",
                borderColor: "var(--bg-button)",
                "&:hover": {
                  borderColor: "var(--bg-button)",
                  backgroundColor: "rgba(var(--bg-button-rgb), 0.1)",
                },
              }}
            >
              Clear Filters
            </Button>
            <IconButton title="Export Data">
              <CSVLink data={csvData} filename="data.csv">
                <BiExport size={30} color="var(--bg-button)" />
              </CSVLink>
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  table: propTypes.object.isRequired,
  type: propTypes.string,
  csvData: propTypes.any,
  bulkDelete: propTypes.func,
  setBranch: propTypes.func,
  totalCount: propTypes.number,
  onRefresh: propTypes.func,
};

export default Toolbar;
