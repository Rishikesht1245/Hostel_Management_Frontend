import { getAllComplaintsAPI, newComplaintAPI } from "../../apiRoutes/student";
import moment from "moment";
import { useMemo, useCallback, useEffect, useState } from "react";
import Table, { Media, TableColumn } from "../../components/Table";
// for the type for useState to store the complaints data
import { IComplaint } from "../../interfaces/complaints";
import { viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalRow from "../../components/UI/ModalRow";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import { Formik, Form } from "formik";
import { newComplaintSchema } from "../../schema/complaints";
import { toast } from "react-hot-toast";
import Input from "../../components/forms/Input";
import SelectInput from "../../components/forms/SelectInput";

const Complaints = () => {
  const [allComplaints, setAllComplaints] = useState<IComplaint[]>([]);
  const [viewComplaint, setViewComplaint] = useState<IComplaint | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newComplaintModal, setNewComplaintModal] = useState<boolean>(false);

  //   fetch all the complaints
  const fetchAllComplaints = useCallback((filterBy?: string) => {
    setPending(true);
    getAllComplaintsAPI(filterBy)
      .then(({ data: { data } }) => setAllComplaints(data))
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => {
          setErrorMessage(message);
          setAllComplaints([]);
        }
      )
      .finally(() => setPending(false));
  }, []);

  //   fetching complaints (initial)
  useEffect(() => {
    fetchAllComplaints();
  }, []);

  //   Columns for data tables
  const columns: TableColumn<IComplaint>[] = useMemo(
    () => [
      {
        name: "Complaint ID",
        sortable: true,
        //   from 10 th onwards
        selector: (row) => row._id.slice(10),
        grow: 2,
      },
      {
        name: "Staff",
        sortable: true,
        selector: (row) => row?.staff?.name || "Unassigned",
        grow: 2,
      },
      {
        name: "Status",
        sortable: true,
        selector: (row) => row?.status,
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
              title="View Complaint"
              onClick={() => {
                setViewComplaint(row);
                setModalOpen(true);
              }}
            >
              <img
                src={viewIcon}
                className="image-button h-7"
                alt="View Button"
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

  //   New complaint handler
  const newComplaintHandler = () => {
    // close the view modal
    setModalOpen(false);
    return setNewComplaintModal(true);
  };

  // filter Element ---   no searching so no need for storing filterBy in a state
  const filterElement = (
    <select
      onChange={(e) => fetchAllComplaints(e.target.value)}
      className="text-gray-400 py-2 px-4 text-sm rounded-md max-w-fit mb-2 md:absolute md:top-10 max-auto shadow focus:outline-none"
    >
      <option value={""}>Filter by status</option>
      <option value={""}>All Complaints</option>
      <option value={"resolved"}>Resolved</option>
      <option value={"initiated"}>Initiated</option>
      <option value={"issued"}>Issued</option>
      <option value={"approval"}>Approval</option>
      <option value={"rejected"}>Rejected</option>
    </select>
  );

  //   department options
  const departmentOptions = useMemo(
    () => [
      { value: "maintenance", text: "Maintenance" },
      { value: "chef", text: "Chef" },
      { value: "warden", text: "Warden" },
    ],
    []
  );
  return (
    <div className="parent-container md:relative">
      <h2>Complaints</h2>
      {filterElement}
      <Table columns={columns} data={allComplaints} pending={pending} />
      {/* view modal */}
      <Modal
        isOpen={modalOpen}
        heading="Complaint Details"
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow label="Complaint ID" value={viewComplaint?._id} />
          <ModalRow label="Message" value={viewComplaint?.message} />
          <ModalRow
            label="Raised On"
            value={moment(viewComplaint?.createdAt).format("LLL")}
          />
          <ModalRowDivider />
          <ModalRow
            label="Staff"
            value={viewComplaint?.staff?.name || "Not assigned"}
          />
          {viewComplaint?.staff && (
            <ModalRow label="Staff Email" value={viewComplaint?.staff?.email} />
          )}
          <ModalRowDivider />
          <ModalRow
            label="Status"
            value={viewComplaint?.status.toUpperCase()}
          />
          <ModalRow
            label="Updated On"
            value={moment(viewComplaint?.updatedAt).format("LLL")}
          />
          {viewComplaint?.status === "resolved" ||
            (viewComplaint?.status === "rejected" && (
              <ModalRow label="Remarks" value={viewComplaint?.remarks} />
            ))}
        </ModalDiv>
      </Modal>
      {/* New Complaint button */}
      <Button
        type="button"
        className="max-w-max px-9 text-sm mx-auto mt-3"
        onClick={newComplaintHandler}
      >
        New Complaint
      </Button>
      {newComplaintModal && (
        <Modal
          isOpen={newComplaintModal}
          heading="New Complaint"
          closeHandler={setNewComplaintModal}
        >
          <Formik
            initialValues={{
              department: "" as "maintenance" | "chef" | "warden",
              message: "",
            }}
            validationSchema={newComplaintSchema}
            onSubmit={(formData, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage(null);
              newComplaintAPI(formData)
                .then(() => {
                  fetchAllComplaints();
                  setNewComplaintModal(false);
                  toast.success("Complaint submitted");
                })
                .catch(
                  ({
                    response: {
                      data: { message },
                    },
                  }) => {
                    setErrorMessage(message);
                  }
                )
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col justify-center gap-4 px-1 mb-3">
                <ModalRow label="Department">
                  <SelectInput
                    options={departmentOptions}
                    label="Choose a Department"
                    name="department"
                  />
                </ModalRow>
                <ModalRow label="Message">
                  <Input
                    type="text"
                    placeholder="Enter your complaint..."
                    name="message"
                  />
                </ModalRow>
                {isSubmitting ? (
                  <LoadingButton />
                ) : (
                  <Button className="max-w-fit mt-4 mx-auto px-6" type="submit">
                    Raise Complaint
                  </Button>
                )}
              </Form>
            )}
          </Formik>
          {errorMessage && (
            <span className="text-center text-md font-semibold text-red-700">
              {errorMessage}
            </span>
          )}
        </Modal>
      )}
    </div>
  );
};
export default Complaints;
