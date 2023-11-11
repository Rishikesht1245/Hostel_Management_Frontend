import {
  fetchAllComplaintsAPI,
  updateComplaintAPI,
  fetchStaffsByDeptAPI,
} from "../../apiRoutes/chiefWarden";
import moment from "moment";
import { Form, Formik } from "formik";
import { useMemo, useCallback, useEffect, useState } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import {
  IComplaint,
  IComplaintUpdate,
  StaffDepartment,
} from "../../interfaces/complaints";
import { viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRow from "../../components/UI/ModalRow";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import Input from "../../components/forms/Input";
import SelectInput from "../../components/forms/SelectInput";
import { updateComplaintSchema } from "../../schema/complaints";
import { IStaff } from "../../interfaces/staff";
import { toast } from "react-hot-toast";

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState<IComplaint[]>([]);
  const [modalData, setModalData] = useState<IComplaint | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [staffsByDept, setStaffsByDept] = useState<any>([]);

  // fetching complaints with filter
  const fetchAllComplaints = useCallback((filterBy?: string) => {
    setPending(true);
    fetchAllComplaintsAPI(filterBy)
      .then(({ data: { data } }) => setAllComplaints(data))
      .catch(() => setAllComplaints([]))
      .finally(() => setPending(false));
  }, []);

  //   initial fetching of complaints
  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const columns: TableColumn<IComplaint>[] = useMemo(
    () => [
      {
        name: "Complaint ID",
        sortable: true,
        selector: (row) => row._id,
        grow: 2,
      },
      {
        name: "Status",
        sortable: true,
        selector: (row) => row.status.toUpperCase(),
        hide: Media.SM,
      },
      {
        name: "Date",
        sortable: true,
        selector: (row) => moment(row.createdAt).format("L"),
        hide: Media.SM,
      },
      {
        name: "Actions",
        cell: (row) => {
          return (
            <button
              title="View Button"
              onClick={() => {
                setModalData(row);
                //     if it is unassigned complaint fetch the staffs for respective dept (select Input)
                if (!row?.staff)
                  fetchStaffsByDept(row?.department).then(() =>
                    setModalOpen(true)
                  );
                setModalOpen(true);
              }}
            >
              <img
                src={viewIcon}
                alt="View Icon"
                className="image-button h-7"
              />
            </button>
          );
        },
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  const fetchStaffsByDept = useCallback(async (department: StaffDepartment) => {
    const {
      data: { data },
    } = await fetchStaffsByDeptAPI(department);

    //     staff options for select input
    const staffOptions = data.map(({ _id, name }: IStaff) => {
      return {
        text: name,
        value: _id,
      };
    });

    return setStaffsByDept(staffOptions);
  }, []);

  //   complaint status options for select inputs
  const complaintStatusOptions = useMemo(
    () => [
      {
        text: "REJECTED",
        value: "rejected",
      },
      {
        text: "RESOLVED",
        value: "resolved",
      },
      {
        text: "ISSUED",
        value: "issued",
      },
    ],
    []
  );

  // filter Element ---   no searching so no need for storing filterBy in a state
  const filterElement = (
    <select
      onChange={(e) => fetchAllComplaints(e.target.value)}
      className="text-gray-400 py-2 px-4 text-sm rounded-md max-w-fit mb-2 md:absolute md:top-10 max-auto shadow focus:outline-none"
    >
      <option value={""}>Filter by status</option>
      <option value={""}>All complaints</option>
      <option value={"resolved"}>Resolved</option>
      <option value={"initiated"}>Initiated</option>
      <option value={"issued"}>Issued</option>
      <option value={"approval"}>Approval</option>
      <option value={"rejected"}>Rejected</option>
    </select>
  );

  return (
    <div className="parent-container relative">
      <h2>Complaints</h2>
      {filterElement}
      <Table columns={columns} data={allComplaints} pending={pending} />

      {/* Complaint details Modal */}
      <Modal
        isOpen={modalOpen}
        heading="Complaint Details"
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow value={modalData?.student?.name} label="Name" />
          <ModalRow value={modalData?.student?.email} label="Email" />
          <ModalRow value={modalData?.message} label="Message" />
          <ModalRow
            value={moment(modalData?.createdAt).format("LLL")}
            label="Date"
          />
          <ModalRowDivider />
          {/* Update complaint form */}
          <Formik
            initialValues={{
              staff: modalData?.staff?._id || "",
              status: "",
              oldStatus: modalData?.status,
              remarks: modalData?.remarks || "",
            }}
            validationSchema={updateComplaintSchema}
            onSubmit={(formData, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage(null);
              updateComplaintAPI(modalData?._id!, formData as IComplaintUpdate)
                .then(() => {
                  fetchAllComplaints();
                  setModalOpen(false);
                  toast.success("Complaint updated");
                })
                .catch(
                  ({
                    response: {
                      data: { message },
                    },
                  }) => setErrorMessage(message)
                )
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col justify-center mb-3">
                <ModalRow
                  value={modalData?.department?.toUpperCase()}
                  label="Department"
                />
                {/* staff name or assign staff to unassigned complaints */}
                <ModalRow label="Staff">
                  {modalData?.staff ? (
                    modalData?.staff?.name
                  ) : (
                    <SelectInput
                      options={staffsByDept}
                      label="Not assigned"
                      name="staff"
                    />
                  )}
                </ModalRow>
                <ModalRowDivider />
                <ModalRow
                  label="Status"
                  value={modalData?.status?.toUpperCase()}
                />
                <ModalRow
                  label="Date"
                  value={moment(modalData?.updatedAt).format("LLL")}
                />
                {/* Status update select input (don't show for rejected or resolved complaints) */}
                {(modalData?.status === "initiated" ||
                  modalData?.status === "issued" ||
                  modalData?.status === "approval") && (
                  <ModalRow label="Update">
                    <SelectInput
                      options={complaintStatusOptions.filter(
                        (option) => option?.value !== modalData?.status
                      )}
                      label="Select Status"
                      name="status"
                    />
                  </ModalRow>
                )}

                {/* Remarks input */}
                {modalData?.status === "initiated" ||
                modalData?.status === "approval" ||
                modalData?.status === "issued" ? (
                  <ModalRow label="Remarks">
                    <Input
                      type="text"
                      placeholder="Remarks by chief warden"
                      name="remarks"
                    />
                  </ModalRow>
                ) : (
                  <ModalRow label="Remarks" value={modalData?.remarks} />
                )}
                {(modalData?.status === "initiated" ||
                  modalData?.status === "approval" ||
                  modalData?.status === "issued") && (
                  <div className="text-center mt-5">
                    {isSubmitting ? (
                      <LoadingButton className="mx-auto px-10" />
                    ) : (
                      <Button type="submit" className="mx-auto">
                        Update Complaint
                      </Button>
                    )}
                  </div>
                )}
              </Form>
            )}
          </Formik>
          {errorMessage && (
            <span className="text-center text-md font-semibold text-red-700">
              {errorMessage}
            </span>
          )}
        </ModalDiv>
      </Modal>
    </div>
  );
};
export default Complaints;
