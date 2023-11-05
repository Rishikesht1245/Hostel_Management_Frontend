import { useState, useEffect, useMemo, useCallback } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import { toast } from "react-hot-toast";
import { tickIcon, viewIcon, disabledIcon } from "../../assets/icons";
import MealPlanForm from "../../components/forms/MealPlanForm";
import {
  fetchAllMealPlans,
  changeAvailabilityMealPlan,
} from "../../apiRoutes/staff";

const MealPlans = () => {
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allMeals, setAllMeals] = useState<any>([]);
  const [modalData, setModalData] = useState<any>(null);
  //   for update and edit form reusability
  const [formRole, setFormRole] = useState<"edit" | "new">("edit");

  const fetchAllMeals = useCallback(() => {
    // response.data.data
    fetchAllMealPlans()
      .then(({ data: { data } }) => setAllMeals(data))
      .catch(({ response }) => {
        if (!response?.data?.message)
          return toast.error("Something went Wrong!");
        toast.error(response?.data?.message);
      })
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    fetchAllMeals();
  }, []);

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
      },
      {
        name: "Availability",
        selector: (row) => (row.active ? "In-Menu" : "Unavailable"),
        sortable: true,
        hide: Media.SM,
      },
      {
        name: "Price",
        selector: (row) => row.price,
        sortable: true,
        hide: Media.SM,
      },
      {
        name: "Students",
        selector: (row) => row.subscribers,
        sortable: true,
        hide: Media.SM,
      },
      {
        name: "Actions",
        grow: 2,
        cell: (row) => {
          return (
            <div className="gap-2">
              {/* view button for opening modal with row data (edit form in modal) */}
              <button
                onClick={() => {
                  setModalData(row);
                  setModalOpen(true);
                  setFormRole("edit");
                }}
              >
                <img
                  src={viewIcon}
                  alt="view icon"
                  className="image-button h-7 mr-1"
                />
              </button>
              {/* change availability of meal plans */}
              <button
                onClick={() =>
                  changeAvailabilityMealPlan(row._id)
                    .then(
                      // fetching the updated meal plans -- passed as call back
                      fetchAllMeals
                    )
                    .then(() => toast.success(`${row?.title} plan updated`))
                }
              >
                {row?.active ? (
                  <img
                    className="image-button h-7"
                    src={tickIcon}
                    alt="Active icon"
                  />
                ) : (
                  <img
                    className="image-button h-7"
                    src={disabledIcon}
                    alt="Active icon"
                  />
                )}
              </button>
            </div>
          );
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    []
  );

  const newMealPlanHandler = (): void => {
    setFormRole("new");
    setModalData([]);
    setModalOpen(true);
  };

  return (
    <div className="parent-container">
      <h2>Meals Plans</h2>
      {/* Data Table */}
      <Table columns={columns} data={allMeals} pending={pending} />
      {/* add new plan button on click -> trigger the modal with new meal plan form */}
      <Button
        className="max-w-max px-9 text-sm mx-auto mt-3"
        type="button"
        onClick={newMealPlanHandler}
      >
        New Meal Plan
      </Button>
      {/* Modal */}

      <Modal
        isOpen={modalOpen}
        heading="Meal Plan Details"
        closeHandler={setModalOpen}
      >
        {modalData && (
          <MealPlanForm
            fetchAllMeals={fetchAllMeals}
            modalData={modalData}
            role={formRole}
            setModalOpen={setModalOpen}
            user="chef"
          />
        )}
      </Modal>
    </div>
  );
};
export default MealPlans;
