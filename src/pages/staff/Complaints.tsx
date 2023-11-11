import {
  fetchAllComplaintsAPI,
  updateComplaintAPI,
} from "../../apiRoutes/staff";
import moment from "moment";
import { Formik, Form } from "formik";
import { useState, useCallback, useMemo, useEffect } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import { IComplaint } from "../../interfaces/complaints";
import { viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalRow from "../../components/UI/ModalRow";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import Input from "../../components/forms/Input";
import Button from "../../components/UI/Button";
import LoadingButton from "../../components/UI/LoadingButton";
import { updateComplaintByStaff } from "../../schema/complaints";
import { toast } from "react-hot-toast";

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState<IComplaint[]>([]);
  const [pending, setPending] = useState<boolean>(true);
  const [modalData, setModalData] = useState<IComplaint | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //   fetch all complaints assigned to this user
  const fetchAllComplaints = useCallback((filterBy?: string) => {
    setPending(true);
    fetchAllComplaintsAPI(filterBy)
      .then(({ data: { data } }) => setAllComplaints(data))
      .catch(() => setAllComplaints([]))
      .finally(() => setPending(false));
  }, []);

  //   initial fetching of all complaints
  useEffect(() => {
    fetchAllComplaints();
  }, []);

  //   columns for data table
  const columns: TableColumn<IComplaint>[] = useMemo(
    () => [
      {
        name: "Student",
        sortable: true,
        selector: (row) => row.student?.name,
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
        cell: (row) => (
          <button
            title="view button"
            onClick={() => {
              setModalData(row);
              setModalOpen(true);
            }}
          >
            <img src={viewIcon} alt="view" className="image-button h-7" />
          </button>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  const filterElement = (
    <select
      onChange={(e) => fetchAllComplaints(e.target.value)}
      className="text-gray-400 text-sm rounded-md px-4 py-2 max-w-fit mb-2 md:absolute md:top-10 mx-auto shadow focus:outline-none"
    >
      <option value={""}>All complaints</option>
      <option value={"issued"}>Issued</option>
      <option value={"approval"}>Approval</option>
      <option value={"resolved"}>Resolved</option>
      <option value={"rejected"}>Rejected</option>
    </select>
  );

  return (
    <div className="parent-container relative">
      <h2>Complaints</h2>
      {filterElement}
      {/* all complaints data table */}
      <Table columns={columns} data={allComplaints} pending={pending} />
      {/* View Modal */}
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
          {/* Form for updating status to approval and adding remarks */}
          <Formik
            initialValues={{
              status: "approval",
              remarks: modalData?.remarks || "",
            }}
            validationSchema={updateComplaintByStaff}
            onSubmit={(formData, { setSubmitting }) => {
              setErrorMessage(null);
              setSubmitting(true);
              updateComplaintAPI(modalData?._id!, formData)
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
              <div className="text-sm">
                <Form>
                  <ModalDiv>
                    <ModalRow
                      value={modalData?.department?.toUpperCase()}
                      label="Department"
                    />
                    <ModalRow value={modalData?.staff?.name} label="Staff" />
                    <ModalRowDivider />
                    <ModalRow
                      value={modalData?.status?.toUpperCase()}
                      label="Status"
                    />
                    <ModalRow
                      value={moment(modalData?.updatedAt).format("LLL")}
                      label="Date"
                    />
                    {modalData?.status === "initiated" ||
                    modalData?.status === "approval" ||
                    modalData?.status === "issued" ? (
                      <ModalRow label="Remarks">
                        <Input
                          name="remarks"
                          placeholder="Remarks by chief warden"
                          type="text"
                          className="mt-3 md:w-96"
                        />
                      </ModalRow>
                    ) : (
                      <ModalRow label="Remarks" value={modalData?.remarks} />
                    )}

                    {(modalData?.status === "initiated" ||
                      modalData?.status === "approval" ||
                      modalData?.status === "issued") && (
                      <div className="mt-5 text-center">
                        {isSubmitting ? (
                          <LoadingButton className="mx-auto px-10" />
                        ) : (
                          <Button type="submit" className="mx-auto">
                            Update Complaint
                          </Button>
                        )}
                      </div>
                    )}
                  </ModalDiv>
                </Form>
              </div>
            )}
          </Formik>
          {errorMessage && (
            <span className="text-red-700 text-md text-center font-semibold">
              {errorMessage}
            </span>
          )}
        </ModalDiv>
      </Modal>
    </div>
  );
};
export default Complaints;
