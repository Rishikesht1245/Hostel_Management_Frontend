import { useMemo, useEffect, useCallback, useState } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import { editIcon, searchIcon } from "../../assets/icons";
import { IStudent } from "../../interfaces/student";
import {
  fetchAllStudentsAPI,
  updateStudentPaymentAPI,
} from "../../apiRoutes/staff";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import Input from "../../components/forms/Input";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import ModalRow from "../../components/UI/ModalRow";
import ModalDiv from "../../components/UI/ModalDiv";
import moment from "moment";
import { monthlyPaymentSchema } from "../../schema/staff";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
const Students = () => {
  const [studentsData, setStudentsData] = useState<IStudent[]>([]);
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [billAmount, setBillAmount] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");

  const fetchAllStudents = useCallback((filter?: string, search?: string) => {
    setPending(true);
    fetchAllStudentsAPI(filter, search)
      .then(({ data: { data } }) => setStudentsData(data))
      .catch(() => setStudentsData([]))
      .finally(() => setPending(false));
  }, []);

  // initial fetching of students
  useEffect(() => {
    fetchAllStudents();
  }, []);

  // filter handler
  const filterHandler = (value: string) => {
    setFilterBy(value);
    fetchAllStudents(value, searchInput);
  };

  // search handler
  const searchHandler = () => {
    fetchAllStudents(filterBy, searchInput);
    setSearchInput("");
  };

  // columns for data table
  const columns: TableColumn<IStudent>[] = useMemo(
    () => [
      {
        name: "Name",
        sortable: true,
        selector: (row) => row.name,
        grow: 2,
      },
      {
        name: "Pending",
        sortable: true,
        selector: (row) => `₹ ${row.balancePayment}`,
      },
      {
        name: "Last Billed",
        sortable: true,
        selector: (row) => row.lastBilledMonth,
        hide: Media.SM,
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-1">
            <button
              title="View student"
              onClick={() => {
                setStudentData(row);
                // balance payment + food payment + 1500 rent
                setBillAmount(row.balancePayment + row?.mealPlan?.price + 1500);
                setModalOpen(true);
              }}
            >
              <img
                src={editIcon}
                className="image-button h-7"
                alt="view details"
              />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  const filterElement = (
    <select
      onChange={(e) => filterHandler(e.target.value)}
      className="text-gray-400 text-sm rounded-md px-4 py-2 max-w-fit shadow focus:outline-none"
    >
      <option value={""}>Filter by status</option>
      <option value={""}>Filter by status</option>
      <option value={"resident"}>Resident</option>
      <option value={"departed"}>Departed</option>
    </select>
  );

  const searchElement = (
    <form
      className="mx-1 my-2 md:m-0"
      onSubmit={(e) => {
        e.preventDefault();
        return searchHandler();
      }}
    >
      <div className="flex rounded-md md:py-0 h-9 px-4 text-sm shadow focus:outline-none">
        <input
          type="text"
          className="grow focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search student"
        />
        <img
          src={searchIcon}
          className="my-auto active:shadow-lg active:animate-ping h-5 w-5"
          alt="Search Student"
        />
      </div>
    </form>
  );

  return (
    <div className="parent-container">
      <h2>Students</h2>
      <div className="flex flex-col md:flex-row items-center md:justify-between pb-3">
        {filterElement}
        {searchElement}
      </div>
      <Table columns={columns} data={studentsData} pending={pending} />
      <Modal
        isOpen={modalOpen}
        heading="Student Details"
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow label="Name" value={studentData?.name} />
          <ModalRow label="Status" value={studentData?.status} />
          <ModalRow label="Email" value={studentData?.email} />
          <ModalRow label="Mobile" value={studentData?.mobile} />
          <ModalRow label="Department" value={studentData?.department} />
          <ModalRow
            label="Guardian"
            value={`${studentData?.guardianName}, ${studentData?.guardianMobile}`}
          />
          <ModalRow label="Block" value={studentData?.block?.name} />
          <ModalRow label="Room" value={studentData?.room} />
          <ModalRowDivider />
          <ModalRow
            label="Meal Plan"
            value={`${studentData?.mealPlan?.title}, Price : ₹ ${studentData?.mealPlan?.price}`}
          />
          <ModalRow
            label="Paid Payment :"
            value={`₹ ${studentData?.paidPayment}`}
          />
          <ModalRowDivider />
          <ModalRow label="Last billed" value={studentData?.lastBilledMonth} />
          {/* Payment form if student is paid for the current month */}
          {studentData?.lastBilledMonth !==
            moment(Date.now()).format("MMMM YYYY") && (
            <>
              <ModalRow
                label="Month"
                value={moment(Date.now()).format("MMM YYYY")}
              />
              <ModalRow
                label="Total Bill"
                value={`₹ ${billAmount} = ${studentData?.mealPlan?.price} (Meal Plan) + 1500 (Rent) + ${studentData?.balancePayment} (Balance Amount)`}
              />
              <span className="flex">
                {/* additional amount to be added to the students balance amount if any */}
                <span className="w-1/3 md:w-1/4 left-0">Additional:</span>
                <Formik
                  initialValues={{ additionalAmount: 0 }}
                  validationSchema={monthlyPaymentSchema}
                  onSubmit={(formData, { setSubmitting }) => {
                    setSubmitting(true);
                    setErrorMessage(null);
                    updateStudentPaymentAPI(studentData?._id!, formData)
                      .then(() => {
                        fetchAllStudents();
                        setModalOpen(false);
                        toast.success(`${studentData?.name} payment updated`);
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
                  {({ isSubmitting, values }) => (
                    <Form className="text-sm gap-1 flex flex-col">
                      <Input
                        type="number"
                        className="w-20"
                        name="additionalAmount"
                        placeholder="Enter amount ₹"
                      />
                      <span className="text-lg font-semibold">
                        ₹ {billAmount + values.additionalAmount}
                      </span>
                      {isSubmitting ? (
                        <LoadingButton className="mx-auto" />
                      ) : (
                        <Button className="mx-auto" type="submit">
                          Send Bill
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
              </span>
            </>
          )}
        </ModalDiv>
      </Modal>
    </div>
  );
};
export default Students;
