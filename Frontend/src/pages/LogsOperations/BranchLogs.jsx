import { Helmet } from "react-helmet";
import AdvancedTable from "@src/components/Gateway-System/Table/AdvancedTable";
import PathName from "@src/components/Gateway-System/PathName/PathName";
import styles from "@styles/Details.module.css"; // Reuse details styles for consistent layout

const BranchLogs = () => {
    // Mock data for the table
    const mockData = [
        {
            id: 1,
            date: "2023-10-27",
            time: "10:30 AM",
            from_branch: "Cairo Branch",
            to_branch: "Giza Branch",
            operator: "Admin User",
            trainee_name: "John Doe"
        },
        {
            id: 2,
            date: "2023-10-26",
            time: "02:15 PM",
            from_branch: "Alex Branch",
            to_branch: "Cairo Branch",
            operator: "Manager User",
            trainee_name: "Jane Smith"
        },
        {
            id: 3,
            date: "2023-10-25",
            time: "09:00 AM",
            from_branch: "Giza Branch",
            to_branch: "Alex Branch",
            operator: "Admin User",
            trainee_name: "Ahmed Ali"
        }
    ];

    const columns = [
        {
            accessorKey: "date",
            header: "Date",
            size: 100,
        },
        {
            accessorKey: "time",
            header: "Time",
            size: 100,
        },
        {
            accessorKey: "trainee_name",
            header: "Trainee Name",
            size: 150,
        },
        {
            accessorKey: "from_branch",
            header: "From (Old Branch)",
            size: 150,
        },
        {
            accessorKey: "to_branch",
            header: "To (New Branch)",
            size: 150,
        },
        {
            accessorKey: "operator",
            header: "Operator (Who made)",
            size: 150,
        },
    ];

    return (
        <div className={styles.Details}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Gateway System | Branch Logs</title>
            </Helmet>

            <PathName path="Branch Logs" back={false} />

            <div className={styles.trainees} style={{ marginTop: "20px" }}>
                <div className={styles.title}>
                    <h2>Branch Change Logs</h2>
                </div>

                <div className={styles.table}>
                    <AdvancedTable
                        columns={columns}
                        rows={mockData}
                        isLoading={false}
                        enableRowSelection={false}
                        enableRowActions={false}
                        enableEditing={false}
                        type="branch_logs"
                    />
                </div>
            </div>
        </div>
    );
};

export default BranchLogs;
