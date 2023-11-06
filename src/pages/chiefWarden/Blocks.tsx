import { useMemo, useEffect, useState, useCallback } from "react";
import Table, { TableColumn, Media } from "../../components/Table";
import { searchIcon, viewIcon } from "../../assets/icons";
import Modal from "../../components/UI/Modal";
import { IBlock, IRoom } from "../../interfaces/blocks";
import { toast } from "react-hot-toast";
import ModalDiv from "../../components/UI/ModalDiv";
import ModalRow from "../../components/UI/ModalRow";
import ModalRowDivider from "../../components/UI/ModalRowDivider";
import { fetchAllBlocksAPI, fetchBlockAPI } from "../../apiRoutes/chiefWarden";
import Button from "../../components/UI/Button";
import BlockForm from "../../components/forms/BlockForm";

const Blocks = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(true);
  const [filterBy, setFilterBy] = useState<string | "">("");
  const [searchInput, setSearchInput] = useState<string | "">("");
  const [allBlocksData, setAllBlocksData] = useState<IBlock[]>([]);
  const [blockData, setBlockData] = useState<IRoom[]>([]);
  const [filteredBlockData, setFilteredBlockData] = useState<IRoom[]>([]);
  const [roomData, setRoomData] = useState<IRoom | null>(null);
  const [addNewForm, setAddNewForm] = useState<boolean>(false);

  //   fetch block by name(filter)
  const fetchBlock = useCallback((filter: string = filterBy) => {
    setPending(true);
    fetchBlockAPI(filter)
      .then(
        ({
          data: {
            data: { rooms },
          },
        }) => {
          setBlockData(rooms);
          //   separate variable for filtered data : otherwise initial block data will get altered (rooms and student based filter)
          setFilteredBlockData(rooms);
        }
      )
      .catch(({ response }) => {
        if (!response?.data?.message)
          return toast.error("Something went wrong");
        return setBlockData([]);
      })
      .finally(() => setPending(false));
  }, []);

  //   fetch all blocks
  const fetchAllBlocks = useCallback(() => {
    fetchAllBlocksAPI()
      .then(({ data: { data } }) => {
        setAllBlocksData(data);
        // block name
        setFilterBy(data[0].name);
        return fetchBlock(data[0].name);
      })
      .catch(({ response }) => {
        if (!response?.data?.message)
          return toast.error("Something went wrong");
        return toast.error(response?.data?.message);
      });
  }, []);

  useEffect(() => {
    fetchAllBlocks();
  }, []);

  //   searching based on block code and student names -- filters the blockData
  const searchHandler = () => {
    // filtering data without api call from frontend itself
    setFilteredBlockData(
      blockData.filter(
        ({ code, student }) =>
          code.toLowerCase().includes(searchInput.toLowerCase()) ||
          student?.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
    //     empty the search input
    return setSearchInput("");
  };

  //   columns for data table
  const columns: TableColumn<IRoom>[] = useMemo(
    () => [
      { name: "Room Code", sortable: true, selector: (row) => row.code },
      {
        name: "Status",
        sortable: true,
        selector: (row) => (row?.availability ? "Available" : "Unavailable"),
        hide: Media.SM,
      },
      {
        name: "Student",
        sortable: true,
        selector: (row) => (row?.student ? row?.student?.name : "Unoccupied"),
        grow: 2,
      },
      {
        name: "Actions",
        cell: (row) => {
          return (
            <div className="flex gap-1">
              <button
                title="View Button"
                onClick={() => {
                  setRoomData(row);
                  setModalOpen(true);
                }}
              >
                <img
                  src={viewIcon}
                  alt="View Icon"
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

  //   filter element as variable
  const filterElement = (
    <select
      onChange={({ target: { value } }) => {
        setFilterBy(value);
        fetchBlock(value);
      }}
      className="text-gray-400 text-sm rounded-md px-4 py-2 max-w-fit shadow focus:outline-none"
    >
      {/* Table shows the rooms and it's details present in a block so here is a block wise filter */}
      {allBlocksData?.map(({ name, _id }) => (
        <option key={_id} value={name}>
          {name}
        </option>
      ))}
    </select>
  );

  //   search Element (form) as variable
  const searchElement = (
    <form
      className="mx-1 my-2 md:m-0"
      onSubmit={(e) => {
        e.preventDefault();
        return searchHandler();
      }}
    >
      <div className="flex rounded-md md:py-0 h-9 px-4 text-sm shadow">
        <input
          type="text"
          className="grow focus:outline-none"
          value={searchInput}
          onChange={({ target: { value } }) => setSearchInput(value)}
          placeholder="Search student /room"
        />
        <button type="submit">
          <img
            src={searchIcon}
            className="my-auto active:shadow-lg active:animate-ping h-6 w-6"
            alt="Search student / room"
          />
        </button>
      </div>
    </form>
  );

  // open and close add new form
  const openAddNewForm = () => {
    setModalOpen(true);
    setAddNewForm(true);
  };

  const closeAddNewForm = (value: boolean) => {
    setModalOpen(value);
    setAddNewForm(value);
  };

  return (
    <div className="parent-container">
      <h2>Blocks</h2>
      <div className="flex flex-col items-center md:flex-row md:justify-between pb-3">
        {filterElement}
        {searchElement}
      </div>
      {/* block name */}
      <h3 className="mx-auto my-2 font-bold text-base text-primary underline underline-offset-2">
        {filterBy ? filterBy : "Block"}
      </h3>
      <Table columns={columns} data={filteredBlockData} pending={pending} />
      <Button
        className="max-w-max mx-auto mt-3 px-9"
        type="button"
        onClick={openAddNewForm}
      >
        New Block
      </Button>
      {addNewForm ? (
        <Modal
          isOpen={modalOpen}
          heading="Block Details"
          closeHandler={closeAddNewForm}
        >
          <BlockForm
            fetchAllBlocks={fetchAllBlocks}
            setModalOpen={setModalOpen}
          />
        </Modal>
      ) : (
        <Modal
          isOpen={modalOpen}
          heading="Room Details"
          closeHandler={setModalOpen}
        >
          <ModalDiv>
            <ModalRow label="Block" value={filterBy} />
            <ModalRow label="Room Code" value={roomData?.code} />
            <ModalRow label="Room No." value={roomData?.number} />
            <ModalRowDivider />
            <ModalRow
              label="Occupancy"
              value={roomData?.student ? "Occupied" : "Unoccupied"}
            />
            {roomData?.student ? (
              <>
                <ModalRow
                  label="Student Name"
                  value={roomData?.student?.name}
                />
                <ModalRow
                  label="Student Email"
                  value={roomData?.student?.email}
                />
              </>
            ) : (
              <ModalRow
                label="Status"
                value={
                  roomData?.availability ? "Available" : "Under maintenance"
                }
              />
            )}
          </ModalDiv>
        </Modal>
      )}
    </div>
  );
};
export default Blocks;
