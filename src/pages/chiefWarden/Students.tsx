import { useMemo, useEffect, useCallback, useState } from "react";
import {
  fetchAllStudentsAPI,
  fetchAvailableRoomsAPI,
  checkRoomAvailabilityAPI,
  updateSingleStudentAPI,
} from "../../apiRoutes/chiefWarden";
import Table, { Media, TableColumn } from "../../components/Table";
import {
  editIcon,
  searchIcon,
  tickIcon,
  disabledIcon,
} from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRow from "../../components/UI/ModalRow";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import { IRoom } from "../../interfaces/blocks";
import { IStudent } from "../../interfaces/student";
import { Form, Formik } from "formik";
import SelectInput from "../../components/forms/SelectInput";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import toast from "react-hot-toast";
import { updateStudentSchema } from "../../schema/student";

const Students = () => {
  const [studentsData, setStudentsData] = useState<IStudent[]>([]);
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<
    { value: string; text: string }[]
  >([{ value: "", text: "" }]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [roomAvailability, setRoomAvailability] = useState<
    "available" | "unavailable" | null
  >(null);

  //   fetch all student
  const fetchAllStudents = useCallback((filter?: string, search?: string) => {
    setPending(true);
    fetchAllStudentsAPI(filter, search)
      .then(({ data: { data } }) => setStudentsData(data))
      .catch(() => setStudentsData([]))
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    // initial fetch without search and filter
    fetchAllStudents();
  }, []);

  const filterHandler = (value: string) => {
    setFilterBy(value);
    fetchAllStudents(value, searchInput);
  };

  const searchHandler = () => {
    fetchAllStudents(filterBy, searchInput);
    setSearchInput("");
  };

  const columns: TableColumn<IStudent>[] = useMemo(
    () => [
      { name: "Name", sortable: true, selector: (row) => row.name, grow: 2 },
      { name: "Status", sortable: true, selector: (row) => row.status },
      {
        name: "Room",
        sortable: true,
        selector: (row) => row.room,
        hide: Media.SM,
      },
      {
        name: "Actions",
        sortable: true,
        cell: (row) => {
          return (
            <div className="flex gap-1">
              <button
                title="View Button"
                onClick={() => {
                  setStudentData(row);
                  // current room of student (for pending student details) -- check here also
                  checkRoomAvailabilityAPI(row.room)
                    .then(({ data }) => {
                      data
                        ? setRoomAvailability("available")
                        : setRoomAvailability("unavailable");
                    })
                    .catch(() => setRoomAvailability("unavailable"))
                    .finally(() => {
                      fetchAvailableRoomsAPI(row?.block?._id!)
                        .then(({ data: { data } }) => {
                          // setting available rooms for select input
                          setAvailableRooms(
                            data.map((room: IRoom) => {
                              return { value: room.code, text: room?.code };
                            })
                          );
                        })
                        .catch(() => toast.error("Something went wrong"))
                        // open the modal with student details
                        .finally(() => setModalOpen(true));
                    });
                }}
              >
                <img
                  src={editIcon}
                  alt="edit student"
                  className="image-button h-7"
                />
              </button>
            </div>
          );
        },
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  const filterElement = (
    <select
      className="text-sm text-gray-400 rounded-md shadow px-4 py-2 max-w-fit focus:outline-none"
      onChange={(e) => filterHandler(e.target?.value)}
    >
      <option value={""}>Filter by status</option>
      <option value={""}>All Students</option>
      <option value={"pending"}>Pending</option>
      <option value={"rejected"}>rejected</option>
      <option value={"departed"}>departed</option>
      <option value={"resident"}>resident</option>
    </select>
  );

  const searchElement = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        return searchHandler();
      }}
    >
      <div className="flex rounded-md md:py-0 h-9 px-4 text-sm shadow focus:outline-none">
        <input
          type="text"
          onChange={(e) => setSearchInput(e.target.value)}
          className="grow focus:outline-none"
          placeholder="Search student"
        />
        <img
          src={searchIcon}
          alt="search"
          className="my-auto active:shadow-lg active:animate-ping h-6 w-6"
        />
      </div>
    </form>
  );

  const studentStatusOptions = useMemo(
    () => [
      { text: "PENDING", value: "pending" },
      { text: "DEPARTED", value: "departed" },
      { text: "REJECTED", value: "rejected" },
      { text: "RESIDENT", value: "resident" },
    ],
    []
  );

  return (
    <div className="parent-container">
      <h2>Students</h2>
      <div className="flex flex-col items-center md:flex-row md:justify-between pb-3">
        {filterElement}
        {searchElement}
      </div>
      <Table columns={columns} data={studentsData} pending={pending} />
      <Modal
        isOpen={modalOpen}
        heading={"Student Details"}
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow label="Name" value={studentData?.name} />
          <ModalRow label="Email" value={studentData?.email} />
          <ModalRow label="Mobile" value={studentData?.mobile} />
          <ModalRowDivider />
          <ModalRow label="Department" value={studentData?.department} />
          <ModalRow label="Gender" value={studentData?.gender} />
          <ModalRow
            label="Guardian"
            value={(studentData?.guardianName, studentData?.guardianMobile)}
          />
          <ModalRow label="Address">
            <span className="flex flex-col">
              <span>{studentData?.address?.building}</span>
              <span>{studentData?.address?.city}</span>
              <span>{studentData?.address?.pin}</span>
              <span>{studentData?.address?.state}</span>
              <span>{studentData?.address?.country}</span>
            </span>
          </ModalRow>
          <ModalRow label="Blood Group" value={studentData?.bloodGroup} />
          <ModalRow label="Remarks" value={studentData?.remarks} />
          <ModalRow label="Meal Plan" value={studentData?.mealPlan.title} />
          <ModalRow label="Paid Payment" value={studentData?.paidPayment} />
          <ModalRow
            label="Balance Payment"
            value={studentData?.balancePayment}
          />
          <ModalRowDivider />
          <ModalRow label="Room">
            <div className="flex">
              <span>{studentData?.room}</span>
              {/* if student status is pending show status of the room too*/}
              {studentData?.status === "pending" && (
                <div className="ml-3 flex items-center">
                  <span
                    className={`${
                      roomAvailability === "available"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    Rooms is {roomAvailability}
                  </span>
                  {roomAvailability === "available" ? (
                    <img
                      src={tickIcon}
                      alt="room is available"
                      className="ml-1 w-6"
                    />
                  ) : (
                    <img
                      src={disabledIcon}
                      alt="room is available"
                      className="ml-1 w-6"
                    />
                  )}
                </div>
              )}
            </div>
          </ModalRow>
          {/* student update form only for resident or pending students */}
          {(studentData?.status === "pending" ||
            studentData?.status === "resident") && (
            <>
              <ModalRowDivider />
              <ModalRow label="Update">
                <Formik
                  initialValues={{
                    room: studentData?.room,
                    status: studentData?.status,
                    oldRoom: studentData?.room,
                    oldStatus: studentData?.status,
                  }}
                  validationSchema={updateStudentSchema}
                  onSubmit={(formData, { setSubmitting }) => {
                    setSubmitting(true);
                    setErrorMessage(null);
                    // student field in rooms
                    const student = {
                      email: studentData?.email,
                      name: studentData?.name,
                      mealPlan: studentData?.mealPlan._id,
                    };
                    updateSingleStudentAPI(studentData?._id!, {
                      ...formData,
                      student,
                    })
                      .then(() => {
                        fetchAllStudents();
                        setModalOpen(false);
                        toast.success(`${studentData?.name} updated`);
                      })
                      .catch(
                        ({
                          response: {
                            data: { message },
                          },
                        }) => {
                          setErrorMessage(
                            message ? message : "Something went wrong"
                          );
                        }
                      )
                      .finally(() => setSubmitting(false));
                  }}
                >
                  {({ isSubmitting }) => (
                    <>
                      <Form className="flex flex-col justify-center mt-8">
                        <div className="flex flex-col md:flex-row justify-center gap-5 px-1 mb-3">
                          <SelectInput
                            label="Select Room"
                            name="room"
                            options={availableRooms}
                            defaultValue={studentData?.room}
                            edit
                          />
                          {/* change status */}
                          <SelectInput
                            label="Select Status"
                            name="status"
                            options={studentStatusOptions.filter(
                              ({ value }) => {
                                if (studentData?.status === "pending") {
                                  // for pending student show resident and rejected status to update
                                  if (
                                    value === "rejected" ||
                                    value === "resident"
                                  )
                                    return true;
                                  else return false;
                                } else {
                                  if (studentData.status === "resident") {
                                    if (value === "departed") return true;
                                    else return false;
                                  }
                                }
                              }
                            )}
                            defaultValue={studentData?.status.toUpperCase()}
                            edit
                          />
                        </div>
                        {isSubmitting ? (
                          <LoadingButton className="mx-auto px-5" />
                        ) : (
                          <Button type="submit" className="mx-auto">
                            Update Changes
                          </Button>
                        )}
                      </Form>
                      {errorMessage && (
                        <span className="text-center text-md font-semibold text-red-700">
                          {errorMessage}
                        </span>
                      )}
                    </>
                  )}
                </Formik>
              </ModalRow>
            </>
          )}
        </ModalDiv>
      </Modal>
    </div>
  );
};
export default Students;
