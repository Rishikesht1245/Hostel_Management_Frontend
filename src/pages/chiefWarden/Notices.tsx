import Modal from "../../components/UI/Modal";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRow from "../../components/UI/ModalRow";
import Table, { TableColumn, Media } from "../../components/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  newNoticeAPI,
  changeNoticeVisibilityAPI,
  fetchAllNoticesAPI,
  updateNoticeAPI,
  noticeStatisticsAPI,
  deleteNoticeAPI,
} from "../../apiRoutes/chiefWarden";
import { toast } from "react-hot-toast";
import {
  viewIcon,
  editIcon,
  tickIcon,
  disabledIcon,
  deleteIcon,
} from "../../assets/icons";
import NoticeForm from "../../components/forms/NoticeForm";
import Button from "../../components/UI/Button";
import { customPopup } from "../../utils/popup";
import { INotice } from "../../interfaces/notice";
import moment from "moment";

const Notices = () => {
  const [allNotices, setAllNotices] = useState<INotice[]>([]);
  const [pending, setPending] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  //   for view modal true, and for edit and new form false
  const [view, setView] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>(null);
  const [formRole, setFormRole] = useState<"edit" | "new">("edit");

  //    fetch all notices
  const fetchAllNotices = useCallback(() => {
    setPending(true);
    fetchAllNoticesAPI()
      .then(({ data: { data } }) => setAllNotices(data))
      .catch(
        ({
          responses: {
            data: { message },
          },
        }) => toast.error(message)
      )
      .finally(() => setPending(false));
  }, []);

  //   fetching notices
  useEffect(() => {
    fetchAllNotices();
  }, []);

  //   Modal Element
  const DetailsModal = (
    <ModalDiv>
      <ModalRow label="Title" value={modalData?.title} />
      <ModalRow label="Message" value={modalData?.message} />
      <ModalRow label="Audience">
        <span className="w-2/3 flex flex-col">
          <span>
            Student : {modalData?.audience?.student ? "Visible" : "Hidden"}
          </span>
          <span>
            Staff : {modalData?.audience?.staff ? "Visible" : "Hidden"}
          </span>
        </span>
      </ModalRow>
      <ModalRow label="Date" value={moment(modalData?.data).format("L")} />
      {/* Edit Form button */}
      <div className="text-center">
        <button
          title="Edit Notice"
          className="image-button"
          onClick={() => {
            // closing details modal
            setView(false);
            setModalData(modalData);
            setModalOpen(true);
            setFormRole("edit");
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary border-1">
            <h4 className="text-white">Edit Notice</h4>
            <img src={editIcon} alt="Edit Icon" className="h-5" />
          </div>
        </button>
      </div>
    </ModalDiv>
  );

  //   columns for data table
  const columns: TableColumn<INotice>[] = useMemo(
    () => [
      {
        name: "Title",
        sortable: true,
        selector: (row) => row.title,
        grow: 2,
      },
      {
        name: "Active",
        sortable: true,
        selector: (row) => (row.visibility ? "Visible" : "Hidden"),
        hide: Media.SM,
      },
      {
        name: "Actions",
        grow: 2,
        cell: (row) => {
          return (
            <div className="flex gap-1">
              <button
                title="view button"
                onClick={() => {
                  setView(true);
                  setModalData(row);
                  setModalOpen(true);
                }}
              >
                <img
                  src={viewIcon}
                  className="image-button h-7"
                  alt="View details"
                />
              </button>
              <button
                title="Change Visibility"
                onClick={async () => {
                  await changeNoticeVisibilityAPI(row?._id!, row).then(() => {
                    toast.success("Notice updated");
                    fetchAllNotices();
                  });
                }}
              >
                {row?.visibility ? (
                  <img
                    src={tickIcon}
                    className="image-button h-7"
                    alt="Active notice"
                  />
                ) : (
                  <img
                    src={disabledIcon}
                    className="image-button h-7"
                    alt="Disabled notice"
                  />
                )}
              </button>
              <button
                title="Delete Notice"
                onClick={async () => deleteNoticeHandler(row?._id!)}
              >
                <img
                  src={deleteIcon}
                  className="image-button h-7"
                  alt="Delete notice"
                />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  //   clicking delete button
  const deleteNoticeHandler = (_id: string): void => {
    customPopup
      .fire({
        title: "Confirm Delete?",
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: "Delete",
        showConfirmButton: false,
      })
      .then((result) => {
        if (result.isDenied)
          return deleteNoticeAPI(_id).then(({ data }) => {
            fetchAllNotices();
            toast.success(data?.message);
          });
      });
  };

  //   New notice form handler
  const newNoticeHandler = (): void => {
    setFormRole("new");
    setView(false);
    setModalOpen(true);
    setModalData([]);
  };

  return (
    <div className="parent-container">
      <h2>Notices</h2>
      <Table columns={columns} data={allNotices} pending={pending} />
      {/* New Notice Button */}
      <Button
        type="button"
        onClick={newNoticeHandler}
        className="max-w-max px-9 text-sm mx-auto mt-3"
      >
        New Notice
      </Button>
      {/* New and Edit form modal */}
      <Modal
        isOpen={modalOpen}
        heading={modalData?.title || "New Notice"}
        closeHandler={setModalOpen}
      >
        {modalData && view && DetailsModal}
        {modalData && !view && (
          <NoticeForm
            modalData={modalData}
            setModal={setModalOpen}
            role={formRole}
            fetchAllNotices={fetchAllNotices}
          />
        )}
      </Modal>
    </div>
  );
};
export default Notices;
