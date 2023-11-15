import moment from "moment";
import { useMemo, useCallback, useState, useEffect } from "react";
import Table, { Media, TableColumn } from "../../components/Table";
import { viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import ModalRow from "../../components/UI/ModalRow";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import LoadingButton from "../../components/UI/LoadingButton";
import Button from "../../components/UI/Button";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import Input from "../../components/forms/Input";
import {
  currentStudentAPI,
  fetchPaymentsAPI,
  initiatePaymentAPI,
  successfulPaymentAPI,
} from "../../apiRoutes/student";
import { loadScriptRazorPay } from "../../config/razorpay";
import { IPayment, RazorpayResponse } from "../../interfaces/payment";
import { useAppSelector } from "../../App";
import { ICurrentUser } from "../../interfaces/auth";
import { newPaymentSchema } from "../../schema/student";
import ModalDiv from "../../components/UI/ModalDiv";

// Student payment
const Payment = () => {
  const [allPayments, setAllPayments] = useState<IPayment[]>([]);
  const [pending, setPending] = useState<boolean>(true);
  //   for single payments details (view payment)
  const [payment, setPayment] = useState<IPayment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //   for modals
  const [viewPayment, setViewPayment] = useState<boolean>(false);
  const [newPayment, setNewPayment] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<any>(null);

  const student = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );

  //   fetch all payments by student
  const fetchPayments = useCallback(() => {
    setPending(true);
    fetchPaymentsAPI()
      .then(({ data: { data } }) => setAllPayments(data))
      .catch(() => setAllPayments([]))
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    fetchPayments();
    //     fetch current student details
    currentStudentAPI()
      .then(({ data: { data } }) => setStudentData(data))
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => toast.error(message)
      );
  }, []);

  const columns: TableColumn<IPayment>[] = useMemo(
    () => [
      {
        name: "Reference ID",
        sortable: true,
        selector: (row) => row.refId,
        grow: 2,
      },
      {
        name: "Date",
        sortable: true,
        selector: (row) => moment(row.date).format("L"),
        hide: Media.SM,
      },
      {
        name: "Amount",
        sortable: true,
        selector: (row) => row.amount,
      },
      {
        name: "Actions",
        cell: (row) => {
          return (
            <button
              title="View Payment"
              onClick={() => {
                setPayment(row);
                setViewPayment(true);
              }}
            >
              <img src={viewIcon} className="image-button h-7" />
            </button>
          );
        },
        ignoreRowClick: true,
        button: true,
      },
    ],
    []
  );

  //   payment handler module razorpay
  const paymentHandler = async (paymentAmount: number) => {
    try {
      await loadScriptRazorPay("https://checkout.razorpay.com/v1/checkout.js");

      // initiating payment : data contains the order details from razorpay
      const {
        data: { data },
      } = await initiatePaymentAPI(paymentAmount);

      // options for razorpay instance
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_ID,
        currency: data.currency, // INR
        amount: data.amount.toString(), // amount we sent to initiatePaymentAPI
        order_id: data.id, // order Id
        name: "Hostel",
        //   handler function to be called when successful
        handler: async function (response: RazorpayResponse) {
          // data to be sent to server
          const paymentData = {
            orderCreationId: data.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            amount: data.amount.toString(),
          };
          try {
            const {
              data: { message },
            } = await successfulPaymentAPI(paymentData);
            toast.success(message);
            setNewPayment(false);
            return fetchPayments();
          } catch (error) {
            toast.error("Something went wrong please try again");
          }
        },
        //   data to save in razorpay
        prefill: {
          name: student?.currentUser?.name,
          email: student?.currentUser?.email,
          phone_number: student?.currentUser?.mobile,
        },
      };
      // attaching razor pay instance to window and calling the open method
      new window.Razorpay(options).open();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <div className="parent-container">
      <h2>Payments</h2>
      {/* all payments table */}
      <Table columns={columns} data={allPayments} pending={pending} />

      {/* Modal for view payment */}
      <Modal
        isOpen={viewPayment}
        heading="Payment Details"
        closeHandler={setViewPayment}
      >
        <ModalDiv>
          <ModalRow label="Reference ID" value={payment?.refId} />
          <ModalRow label="Date" value={moment(payment?.date).format("LLL")} />
          <ModalRowDivider />
          <ModalRow
            label="Amount"
            value={`₹ ${payment?.amount.toLocaleString("en-IN")}`}
          />
          <ModalRowDivider />
          <ModalRow
            label="Paid Payment"
            value={`₹ ${payment?.paidPayment.toLocaleString("en-IN")}`}
          />
          <ModalRow
            label="Balance Payment"
            value={`₹ ${payment?.balancePayment.toLocaleString("en-IN")}`}
          />
        </ModalDiv>
      </Modal>

      {/* New payment button */}
      <Button
        type="button"
        className="max-w-max px-9 text-sm mx-auto mt-3"
        onClick={() => {
          setViewPayment(false);
          return setNewPayment(true);
        }}
      >
        New Payment
      </Button>

      {/* New payment Modal */}
      {newPayment && (
        <Modal
          isOpen={newPayment}
          heading="New Payment"
          closeHandler={setNewPayment}
        >
          <Formik
            initialValues={{
              amount: 0,
            }}
            validationSchema={newPaymentSchema}
            onSubmit={async ({ amount }, { setSubmitting }) => {
              setErrorMessage(null);
              setSubmitting(true);
              await paymentHandler(amount);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col justify-center gap-2 px-2 mb-3">
                <ModalRow
                  label="Balance Amount"
                  value={`₹ ${studentData?.balancePayment}`}
                />
                <ModalRow
                  label="Paid Amount"
                  value={`₹ ${studentData?.paidPayment}`}
                />
                <ModalRow
                  label="Last billed on"
                  value={`₹ ${studentData?.lastBilledMonth}`}
                />
                <ModalRowDivider />
                <ModalRow label="Amount">
                  <Input
                    name="amount"
                    placeholder="Enter an amount ₹"
                    type="number"
                  />
                </ModalRow>
                {isSubmitting ? (
                  <LoadingButton />
                ) : (
                  <Button type="submit" className="max-w-fit mt-4 mx-auto px-6">
                    Pay
                  </Button>
                )}
                {errorMessage && (
                  <span className="text-red-700 text-md font-semibold">
                    {errorMessage}
                  </span>
                )}
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </div>
  );
};
export default Payment;
