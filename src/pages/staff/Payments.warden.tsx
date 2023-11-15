import moment from "moment";
import { useMemo, useCallback, useState, useEffect } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import { searchIcon, viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalRow from "../../components/UI/ModalRow";
import { fetchAllPaymentsAPI } from "../../apiRoutes/staff";
import { IPayment } from "../../interfaces/payment";
import Button from "../../components/UI/Button";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRowDivider from "../../components/UI/ModalRowDivider";

const Payments = () => {
  const [allPayments, setAllPayments] = useState<IPayment[] | []>([]);
  const [paymentData, setPaymentData] = useState<IPayment | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  const fetchPayments = useCallback((search?: string) => {
    setPending(true);
    fetchAllPaymentsAPI(search)
      .then(({ data: { data } }) => setAllPayments(data))
      .catch(() => setAllPayments([]))
      .finally(() => setPending(false));
  }, []);

  //   Initial fetching of payments
  useEffect(() => {
    fetchPayments();
  }, []);

  const searchHandler = () => {
    fetchPayments(searchInput);
    return setSearchInput("");
  };

  const columns: TableColumn<IPayment>[] = useMemo(
    () => [
      {
        name: "Student",
        sortable: true,
        selector: (row) => row.student?.name,
        grow: 3,
      },
      {
        name: "Ref ID",
        sortable: true,
        selector: (row) => row.refId,
        hide: Media.SM,
      },
      {
        name: "Amount",
        sortable: true,
        selector: (row) => row.amount,
        hide: Media.SM,
      },
      {
        name: "Actions",
        cell: (row) => (
          <button
            title="view payment"
            onClick={() => {
              setPaymentData(row);
              setModalOpen(true);
            }}
          >
            <img
              src={viewIcon}
              className="image-button h-7"
              alt="View Details"
            />
          </button>
        ),
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  return (
    <div className="parent-container relative">
      <h2>Payments</h2>
      <div className="flex flex-col md:flex-row md:justify-between pb-3">
        <form
          className="flex flex-col md:flex-row md:justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            return searchHandler();
          }}
        >
          <div className="flex rounded-md py-2 px-4 h-9 text-sm shadow focus:outline-none">
            <input
              type="text"
              className="grow focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ref id"
            />
            <img
              src={searchIcon}
              className="my-auto active:shadow-lg active:animate-ping h-6 w-6"
              alt="Search"
            />
          </div>
        </form>
      </div>
      {/* all payments button */}
      <Button
        type="button"
        className="text-sm w-1/3 md:w-auto md:mx-0"
        onClick={() => {
          setSearchInput("");
          searchHandler();
        }}
      >
        All Payments
      </Button>
      <Table columns={columns} data={allPayments} pending={pending} />
      <Modal
        isOpen={modalOpen}
        heading="Payment Details"
        closeHandler={setModalOpen}
      >
        <ModalDiv>
          <ModalRow label="Student" value={paymentData?.student?.name} />
          <ModalRow label="Email" value={paymentData?.student?.email} />
          <ModalRowDivider />
          <ModalRow
            label="Amount"
            value={`₹ ${paymentData?.amount.toLocaleString("en-IN")}`}
          />
          <ModalRow label="Ref ID" value={paymentData?.refId} />
          <ModalRow
            label="Date"
            value={moment(paymentData?.date).format("LLL")}
          />
          <ModalRowDivider />
          <ModalRow
            label="Balance Amount"
            value={`₹ ${paymentData?.balancePayment.toLocaleString("en-IN")}`}
          />{" "}
          <ModalRow
            label="Paid Amount"
            value={`₹ ${paymentData?.paidPayment.toLocaleString("en-IN")}`}
          />
        </ModalDiv>
      </Modal>
    </div>
  );
};
export default Payments;
