import { useMemo, useCallback, useEffect, useState } from "react";
import Table, { TableColumn } from "../../components/Table";
import { viewIcon, searchIcon } from "../../assets/icons";
import {
  complaintsByStaffAPI,
  newStaffAPI,
  fetchAllStaffsAPI,
} from "../../apiRoutes/chiefWarden";
import Modal from "../../components/UI/Modal";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRow from "../../components/UI/ModalRow";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import Button from "../../components/UI/Button";
import LoadingButton from "../../components/UI/LoadingButton";
import { Form, Formik } from "formik";
import Input from "../../components/forms/Input";
import PasswordInput from "../../components/forms/PasswordInput";
import SelectInput from "../../components/forms/SelectInput";
import { newStaffSchema } from "../../schema/staff";
import { IStaff } from "../../interfaces/staff";
import { toast } from "react-hot-toast";

const Staffs = () => {
  const [pending, setPending] = useState<boolean>(true);
  const [staffsData, setStaffsData] = useState<IStaff[]>([]);
  const [staffData, setStaffData] = useState<IStaff | null>(null);
  const [filterBy, setFilterBy] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [complaintsStat, setComplaintsStat] = useState<{
    count: number;
    total: number;
  }>({ count: 0, total: 0 });
  const [newStaffModal, setNewStaffModal] = useState<boolean>(false);

  // filter will be the role and search will be name of the staff
  const fetchAllStaffs = useCallback((filter?: string, search?: string) => {
    // pending state for data table
    setPending(true);
    fetchAllStaffsAPI(filter, search)
      .then(({ data: { data } }) => {
        setStaffsData(data);
      })
      .catch(() => setStaffsData([]))
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    // initially no filters or search
    fetchAllStaffs();
  }, []);

  //   fetching staffs based on filter and search Input
  const filterHandler = (value: string) => {
    setFilterBy(value);
    fetchAllStaffs(value, searchInput);
  };

  //   fetching based on search Input and filter
  const searchHandler = () => {
    fetchAllStaffs(filterBy, searchInput);
    setSearchInput("");
  };

  const columns: TableColumn<IStaff>[] = useMemo(
    () => [
      {
        name: "Name",
        sortable: true,
        selector: (row) => row.name,
        grow: 2,
      },
      { name: "Role", sortable: true, selector: (row) => row.role },
      {
        name: "Actions",
        cell: (row) => {
          return (
            <div className="flex gap-1">
              <button
                title="View Staff"
                onClick={() => {
                  setStaffData(row);
                  //get complaints to show in modal
                  complaintsByStaffAPI(row._id).then(({ data: { data } }) => {
                    setComplaintsStat(data);
                    return setModalOpen(true);
                  });
                }}
              >
                <img
                  src={viewIcon}
                  alt="View Staff"
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
      onChange={(e) => filterHandler(e.target.value)}
      className="text-gray-400 rounded-md text-sm px-4 py-2 max-w-fit shadow focus:outline-none"
    >
      <option value={""}>Filter by department</option>
      <option value={""}>All Departments</option>
      <option value={"warden"}>Warden</option>
      <option value={"maintenance"}>Maintenance</option>
      <option value={"chef"}>Chef</option>
    </select>
  );

  const searchElement = (
    <form
      className="mx-1 my-2 md:m-0 shadow-md rounded-md"
      onSubmit={(e) => {
        e.preventDefault();
        searchHandler();
      }}
    >
      <div className="flex rounded-md md:py-0 h-9 px-4 text-sm focus:outline-none">
        <input
          type="text"
          className="grow focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e?.target.value)}
          placeholder="Search staff"
        />
        <img
          src={searchIcon}
          className="my-auto active:shadow-lg active:animate-ping h-6 w-6"
          alt="Search"
        />
      </div>
    </form>
  );

  //   options for select Input in add new staff form
  const staffRoleOptions = useMemo(
    () => [
      { text: "Maintenance", value: "maintenance" },
      { text: "Warden", value: "warden" },
      { text: "Chef", value: "chef" },
    ],
    []
  );

  const genderOptions = useMemo(
    () => [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    []
  );

  return (
    <div className="parent-container">
      <h2>Staffs</h2>
      <div className="flex flex-col items-center md:flex-row md:justify-between pb-3">
        {filterElement}
        {searchElement}
      </div>
      <Table columns={columns} data={staffsData} pending={pending} />
      <Button
        type="button"
        className="max-w-max px-9 text-sm mx-auto mt-3"
        onClick={() => setNewStaffModal(true)}
      >
        New Staff
      </Button>

      {/* Modal for view Staff */}
      <Modal
        isOpen={modalOpen}
        heading="Staff Details"
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow label="Name" value={staffData?.name} />
          <ModalRow label="Email" value={staffData?.email} />
          <ModalRow label="Mobile" value={staffData?.mobile} />
          <ModalRowDivider />
          <ModalRow label="Role" value={staffData?.role.toUpperCase()} />
          <ModalRow label="Complaints" value={complaintsStat?.total} />
          <ModalRow label="Resolved" value={complaintsStat?.count} />
          <ModalRowDivider />
          <ModalRow label="Address">
            <span className="flex flex-col">
              <span>{staffData?.address?.building}</span>
              <span>{staffData?.address?.city}</span>
              <span>{staffData?.address?.pin}</span>
              <span>{staffData?.address?.state}</span>
              <span>{staffData?.address?.country}</span>
            </span>
          </ModalRow>
        </ModalDiv>
      </Modal>
      {/* new staff modal */}
      <Modal
        isOpen={newStaffModal}
        heading="New Staff"
        closeHandler={setNewStaffModal}
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            mobile: "",
            role: "",
            gender: "",
            building: "",
            city: "",
            pin: "",
            state: "",
            country: "",
          }}
          validationSchema={newStaffSchema}
          onSubmit={(formData, { setSubmitting }) => {
            console.log("submitting");
            setSubmitting(true);
            const structuredData = {
              ...formData,
              address: {
                building: formData.building,
                city: formData.city,
                pin: formData.pin,
                state: formData.state,
                country: formData.country,
              },
            };
            newStaffAPI(structuredData)
              .then(() => {
                toast.success(`${formData?.name} added successfully`);
                setNewStaffModal(false);
                //   again fetch all staffs after adding new staff
                fetchAllStaffs();
              })
              .catch(() => toast.error("Error Adding staff"));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col justify-center gap-4 px-1 mb-3 md:w-3/4 mx-auto">
              <Input
                type="email"
                placeholder="School mail"
                className="md:col-span-full lg:col-span-1"
                name="email"
                edit
              />
              <Input type="text" placeholder="Name" name="name" edit />
              <SelectInput
                name="role"
                label="Role"
                options={staffRoleOptions}
                edit
              />
              <Input type="number" placeholder="Mobile" name="mobile" edit />
              <SelectInput
                name="gender"
                label="Gender"
                options={genderOptions}
                edit
              />
              <PasswordInput
                placeholder="Password"
                name="password"
                id="password"
                edit
              />
              <Input type="text" placeholder="Building" name="building" edit />
              <Input type="text" placeholder="City" name="city" edit />
              <Input type="number" placeholder="PIN" name="pin" edit />
              <Input type="text" placeholder="State" name="state" edit />
              <Input type="text" placeholder="Country" name="country" edit />
              {isSubmitting ? (
                <LoadingButton />
              ) : (
                <Button type="submit" className="max-w-fit mx-auto">
                  Submit
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
export default Staffs;
