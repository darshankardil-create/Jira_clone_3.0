"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// (code) is to find by search inter-dependent or related code lines

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  taskno: number;
}

interface TaskWithDates extends Task {
  dueDate: string;
  startDate: string;
  overDuedays: number | null;
}

interface PlaceholderItem {
  //same
  status: string;
  placeholder: string;
  id: string;
  shifted: number;
}

type ColumnItem = TaskWithDates | PlaceholderItem;

type Props = {
  filterbymeclone1: ColumnItem[];
  filterbymeclone2: ColumnItem[];
  filterbymeclone3: ColumnItem[];
  filterbymeclone4: ColumnItem[];

  setfilterbymeclone1: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
  setfilterbymeclone2: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
  setfilterbymeclone3: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
  setfilterbymeclone4: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
};

const Coulmn: React.FC<Props> = ({
  filterbymeclone1,
  filterbymeclone2,
  filterbymeclone3,
  filterbymeclone4,
  setfilterbymeclone1,
  setfilterbymeclone2,
  setfilterbymeclone3,
  setfilterbymeclone4,
}) => {
  //onDrag over  effect of ( + ) symbol and dark blue boder
  const [dragover1, setdragover1] = useState<boolean>(false);
  const [dragover2, setdragover2] = useState<boolean>(false);
  const [dragover3, setdragover3] = useState<boolean>(false);
  const [dragover4, setdragover4] = useState<boolean>(false);

  const [scroll1, setscroll1] = useState<number>(0);
  const [scroll2, setscroll2] = useState<number>(0);
  const [scroll3, setscroll3] = useState<number>(0);
  const [scroll4, setscroll4] = useState<number>(0);

  const [filterbyme1, setfilterbyme1] = useState<ColumnItem[]>([]);
  const [filterbyme2, setfilterbyme2] = useState<ColumnItem[]>([]);
  const [filterbyme3, setfilterbyme3] = useState<ColumnItem[]>([]);
  const [filterbyme4, setfilterbyme4] = useState<ColumnItem[]>([]);

  const col1scroll = useRef<HTMLDivElement>(null);
  const col2scroll = useRef<HTMLDivElement>(null);
  const col3scroll = useRef<HTMLDivElement>(null);
  const col4scroll = useRef<HTMLDivElement>(null);

  //drop state tell exact  coulmn number out of 4 coulmn where user drop the card
  const [drop, setdrop] = useState<number | null>(null);

  //to keep up with scroll
  const [translateY1, settranslateY1] = useState<number>(0);
  const [translateY2, settranslateY2] = useState<number>(0);
  const [translateY3, settranslateY3] = useState<number>(0);
  const [translateY4, settranslateY4] = useState<number>(0);

  useEffect(() => {
    function virtualscroll() {
      //for all coulmn
      const buffer = 5;
      const itemHeight = 120;
      const visibleCount = 5;

      // coulmn 1

      const startIndex1 = Math.floor(scroll1 / itemHeight);

      const from1 = Math.max(0, startIndex1 - buffer); //buffer above
      const to1 = startIndex1 + visibleCount + buffer; //buffer below

      const translateY1 = from1 * itemHeight;

      settranslateY1(translateY1); // for keeping up with scroll

      setfilterbyme1(filterbymeclone1.slice(from1, to1)); // virtual scrolling effect logic

      // coulmn 2

      const startIndex2 = Math.floor(scroll2 / itemHeight);

      const from2 = Math.max(0, startIndex2 - buffer);
      const to2 = startIndex2 + visibleCount + buffer;

      const translateY2 = from2 * itemHeight;

      settranslateY2(translateY2);

      setfilterbyme2(filterbymeclone2.slice(from2, to2));

      // coulmn 3

      const startIndex3 = Math.floor(scroll3 / itemHeight);

      const from3 = Math.max(0, startIndex3 - buffer);
      const to3 = startIndex3 + visibleCount + buffer;

      const translateY3 = from3 * itemHeight;

      settranslateY3(translateY3);

      setfilterbyme3(filterbymeclone3.slice(from3, to3));

      // coulmn 4

      const startIndex4 = Math.floor(scroll4 / itemHeight);

      const from4 = Math.max(0, startIndex4 - buffer);
      const to4 = startIndex4 + visibleCount + buffer;

      const translateY4 = from4 * itemHeight;

      settranslateY4(translateY4);

      setfilterbyme4(filterbymeclone4.slice(from4, to4));
    }

    virtualscroll();
  }, [
    scroll1,
    scroll2,
    filterbymeclone1,
    filterbymeclone2,
    filterbymeclone3,
    scroll3,
    filterbymeclone4,
    scroll4,
  ]);

  const dragStatus = useRef<{ status?: string }>({});

  const [dragitem, setdragitem] = useState<TaskWithDates | null>(null);

  useEffect(() => {
    //remove Blue border and light blue bg effect  after 2 sec of dropping card code:B2
    if (dragStatus.current.status === "success") {
      let timeoutid1: ReturnType<typeof setTimeout>;

      if (dragitem?.id) {
        timeoutid1 = setTimeout(() => setdragitem(null), 2000); //clears the drag object after 2 sec so conditional styaling fails and results into no styling code:b0
      }

      return () => {
        clearTimeout(timeoutid1!);
      };
    }
  }, [
    dragitem,
    filterbymeclone1,
    filterbymeclone2,
    filterbymeclone3,
    filterbymeclone4,
  ]); //for ref dragStatus => filterbymeclone1,2,3and 4 as dependency

  function handledrop1(e: React.DragEvent<HTMLDivElement>) {
    const dataraw = e.dataTransfer.getData("obj");

    const dataobj: TaskWithDates = JSON.parse(dataraw);

    const rejectownobj = filterbyme1.find(
      (f) => (f as TaskWithDates).id === dataobj.id,
    );

    if (rejectownobj) return; // reject onDragOver if already exist in coulmn

    setfilterbymeclone1((prev) => {
      return [{ ...dataobj, status: "To Do" }, ...prev];
    });

    if (dataobj.id) {
      // if able to extract id onDrop that means successed
      dragStatus.current = { status: "success" };
      setdrop(1); //drop to know the  exact coulmn number in which user drop the card
      autoScrollondrop(1);
    } //code:B2

    setdragover1(false); // turn ondragover effect off
  }

  function handledrop2(e: React.DragEvent<HTMLDivElement>) {
    // for detail check handledrop1
    const dataraw = e.dataTransfer.getData("obj");

    const dataobj: TaskWithDates = JSON.parse(dataraw);

    const exist = filterbyme2.find(
      (f) => (f as TaskWithDates).id === dataobj.id,
    );

    if (exist) return;

    setfilterbymeclone2((prev) => {
      return [{ ...dataobj, status: "In Progress" }, ...prev];
    });

    if (dataobj.id) {
      dragStatus.current = { status: "success" };
      setdrop(2);
      autoScrollondrop(2);
    }

    setdragover2(false);
  }

  function handledrop3(e: React.DragEvent<HTMLDivElement>) {
    // for detail check handledrop1
    const dataraw = e.dataTransfer.getData("obj");

    const dataobj: TaskWithDates = JSON.parse(dataraw);

    const rejectownobj = filterbyme3.find(
      (f) => (f as TaskWithDates).id === dataobj.id,
    );

    if (rejectownobj) return;

    setfilterbymeclone3((prev) => {
      return [{ ...dataobj, status: "In Review" }, ...prev];
    });

    if (dataobj.id) {
      dragStatus.current = { status: "success" };
      setdrop(3);
      autoScrollondrop(3);
    }

    setdragover3(false);
  }

  function handledrop4(e: React.DragEvent<HTMLDivElement>) {
    // for detail check handledrop1
    const dataraw = e.dataTransfer.getData("obj");

    const dataobj: TaskWithDates = JSON.parse(dataraw);

    const rejectownobj = filterbyme4.find(
      (f) => (f as TaskWithDates).id === dataobj.id,
    );

    if (rejectownobj) return;

    setfilterbymeclone4((prev) => {
      return [{ ...dataobj, status: "Done" }, ...prev];
    });

    if (dataobj.id) {
      dragStatus.current = { status: "success" };
      setdrop(4);
      autoScrollondrop(4);
    }

    setdragover4(false);
  }

  function offeffectonoverifexist(coulmn: number) {
    // turn + symbol and dark border effect off if onDragOver Item already exist in coulmn
    if (coulmn === 1) {
      const noeffectifexist1 = filterbymeclone1.find(
        (f) => (f as TaskWithDates).id === dragitem?.id,
      );

      if (noeffectifexist1) {
        setdragover1(false);
      }
    } else if (coulmn === 2) {
      const noeffectifexist2 = filterbymeclone2.find(
        (f) => (f as TaskWithDates).id === dragitem?.id,
      );

      if (noeffectifexist2) {
        setdragover2(false);
      }
    } else if (coulmn === 3) {
      const noeffectifexist3 = filterbymeclone3.find(
        (f) => (f as TaskWithDates).id === dragitem?.id,
      );

      if (noeffectifexist3) {
        setdragover3(false);
      }
    } else if (coulmn === 4) {
      const noeffectifexist4 = filterbymeclone4.find(
        (f) => (f as TaskWithDates).id === dragitem?.id,
      );

      if (noeffectifexist4) {
        setdragover4(false);
      }
    }
  }

  //for auto-scroll to top whenever user drop card (auto-scrolls to the top only in the coulmn where user has drop the card because of below logic )
  function autoScrollondrop(col: number) {
    if (!col) return;

    if (col === 1) {
      col1scroll.current!.scrollTop = 0;
    } else if (col === 2) {
      col2scroll.current!.scrollTop = 0;
    } else if (col === 3) {
      col3scroll.current!.scrollTop = 0;
    } else if (col === 4) {
      col4scroll.current!.scrollTop = 0;
    }
  }

  return (
    <>
      {/* coulmn 1 */}
      <div
        className={`lg:h-[80%] md:h-[76%]   w-full bg-slate-200 relative  ${dragover1 ? "border-blue-400 border-6" : ""}`}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setdragover1(true);
          offeffectonoverifexist(1); //overwrite dragover1 with false if dragover id already exist
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          handledrop1(e);
        }}
        onDragLeave={() => setdragover1(false)}
      >
        {dragover1 && (
          <div className="absolute md:top-1/2 md:left-[30%] lg:top-1/3 lg:left-[40%] text-[100px] z-1 text-black ">
            +
          </div>
        )}

        <div className="lg:text-[30px] text-center font-bold ">
          To-do
          <div className="lg:text-[20px] font-black bg-gray-300">
            Totle:
            {
              //  except placeholder
              filterbymeclone1.filter((i) => (i as TaskWithDates).assignee)
                .length
            }{" "}
          </div>
        </div>

        {filterbymeclone1.filter((o) => (o as TaskWithDates).assignee)
          .length === 0 && (
          <div className="w-[90%] border absolute md:h-[85%] lg:h-[80%]   left-3 lg:top-27 md:top-15 font-bold text-gray-500">
            <div className="h-full grid grid-cols-1 place-items-center   text-gray-500">
              <Image
                src={"myimgs/add.svg"}
                width={300}
                height={300}
                alt={"Empty image"}
                className="md:h-100 "
              />

              <p>No task found</p>
            </div>
          </div>
        )}

        <div
          className="overflow-auto absolute lg:top-27  w-[90%] left-[5%] md:top-16 md:h-[88%] lg:h-[83%] "
          ref={col1scroll}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            setscroll1((e.target as HTMLDivElement).scrollTop);
          }}
        >
          {" "}
          <div
            className={`grid grid-cols-1  gap-5 w-full    ${dragover1 ? "blur-sm" : ""} `}
            style={{
              transform: `translateY(${translateY1}px)`,
              position: "absolute",
            }}
          >
            {/*card grid ^ */}
            {filterbyme1.map((i) => {
              if ((i as PlaceholderItem).placeholder === "YES") {
                const pi = i as PlaceholderItem;
                return (
                  // (code:01)
                  <div
                    className="h-30  border grid w-full items-center justify-center text-center  "
                    key={pi.id}
                  >
                    <div className=" font-bold">
                      {pi.shifted === 1
                        ? "Updated status to To-do"
                        : pi.shifted === 2
                          ? "Updated status to In Progress"
                          : pi.shifted === 3
                            ? "Updated status to In Review"
                            : pi.shifted === 4
                              ? "Updated status to done"
                              : ""}{" "}
                      <div className="text-[10px]">
                        To clear all placeholders, simply click the `Remove All
                        Placeholders` button located in the header.
                      </div>{" "}
                    </div>
                  </div>
                );
              }

              const ti = i as TaskWithDates;
              return (
                <div key={ti.id}>
                  <div
                    draggable
                    className={`border cursor-grab ${dragitem?.id === ti.id ? "" : ""} grid grid-cols-1 text-center w-full  h-30 ${ti.id === dragitem?.id ? "bg-blue-300 border-10 border-blue-600" : " bg-white"}`}
                    onDragLeave={() => setdragover1(false)}
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                      e.dataTransfer.setData("obj", JSON.stringify(ti));
                      setdragitem(ti);
                      dragStatus.current = { status: "failed" };
                    }}
                    onDragEnd={() => {
                      if (dragStatus.current.status === "success") {
                        setfilterbymeclone1((prev) => {
                          return prev.map((m) => {
                            if ((m as TaskWithDates).id === ti.id) {
                              return {
                                status: ti.status,
                                placeholder: "YES", //to identify placeholder and return  div with only h,drop and w  while mapping on status success code:01
                                id: crypto.randomUUID(),
                                shifted: drop,
                              } as PlaceholderItem;
                            } else {
                              return m;
                            }
                          });
                        });

                        return;
                      }

                      setdragitem(null); // for failling conditional   stylingapplyed on light blue bg card for the drop which does not have status success
                    }}
                  >
                    {/*card content*/}
                    <div className=" lg:text-[18px] font-black md:text-[9px] md:w-30 md:mx-auto md:h-4  border-b lg:h-8 lg:w-60 lg:mx-auto ">
                      {" "}
                      {ti.taskno} {ti.title}
                    </div>
                    <div className="grid grid-cols-2 relative md:left-2 ">
                      <div
                        className={`text-[15px] font-bold lg:w-30 md:w-15  rounded-[10px] mx-auto   h-6  ${ti.priority === "Critical" ? "bg-red-500 text-white" : ti.priority === "Low" ? "bg-green-300 text-black" : ti.priority === "High" ? "bg-orange-400 text-black" : ti.priority === "Medium" ? "bg-yellow-300 text-black" : ""} `}
                      >
                        {ti.priority}
                      </div>

                      <div className="text-[15px] font-bold bg-blue-400 w-8.5 h-8.5 pt-1 text-white  mx-auto rounded-full relative bottom-1.5 ">
                        {ti.assignee.split(" ")[0].split("")[0] +
                          ti.assignee.split(" ")[1].split("")[0]}
                      </div>

                      <div
                        className={`lg:text-[15px] md:text-[9px] font-bold    md:relative md:right-2.5  `}
                      >
                        {ti.startDate}
                      </div>

                      <div
                        className={`lg:text-[15px] md:relative md:right-3  md:text-[9px] font-bold ${ti.priority !== "Critical" ? "" : "hidden"} `}
                      >
                        due:{ti.dueDate}
                      </div>
                      {ti.overDuedays !== null && (
                        <div className="lg:text-[15px] md:text-[9px] md:right-7 lg:w-31 lg:left-1 md:relative font-bold md:w-25 text-red-500 ">
                          {ti.overDuedays! > 7
                            ? `${ti.overDuedays} days overdue!`
                            : ti.dueDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              // code:108 interrelated by 120px
              height: `${filterbymeclone1.length * 120}px`,
            }}
          />{" "}
        </div>
      </div>
      {/* coulmn 2 */} {/*for detail of logic check coulmn 1 */}
      <div
        className={`lg:h-[80%] md:h-[76%]  w-full bg-slate-200 relative  ${dragover2 ? "border-blue-400 border-6" : ""}`}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();

          setdragover2(true);
          offeffectonoverifexist(2);
        }}
        onDragLeave={() => setdragover2(false)}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          handledrop2(e);
        }}
      >
        {dragover2 && (
          <div className="absolute md:top-1/2 md:left-[30%] lg:top-1/3 lg:left-[40%] text-[100px] z-1 text-black ">
            +
          </div>
        )}

        <div className="lg:text-[30px] text-center font-bold ">
          In Progress
          <div className="lg:text-[20px] font-black bg-gray-300">
            Totle:{" "}
            {
              // except placeholder
              filterbymeclone2.filter((i) => (i as TaskWithDates).assignee)
                .length
            }{" "}
          </div>
        </div>

        {filterbymeclone2.filter((o) => (o as TaskWithDates).assignee)
          .length === 0 && (
          <div className="w-[90%] border absolute md:h-[85%] lg:h-[80%]   left-3 lg:top-27 md:top-15 font-bold text-gray-500">
            <div className="h-full grid grid-cols-1 place-items-center   text-gray-500">
              <Image
                src={"myimgs/add.svg"}
                width={300}
                height={300}
                alt={"Empty image"}
                className="md:h-100 "
              />

              <p>No task found</p>
            </div>
          </div>
        )}

        <div
          className="overflow-auto absolute lg:top-27  w-[90%] left-[5%] md:top-16 md:h-[88%] lg:h-[83%] "
          ref={col2scroll}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            setscroll2((e.target as HTMLDivElement).scrollTop);
          }}
        >
          {" "}
          <div
            className={`grid grid-cols-1 w-full  gap-5 ${dragover2 ? "blur-sm" : ""} `}
            style={{
              transform: `translateY(${translateY2}px)`,
              position: "absolute",
            }}
          >
            {/*card grid ^ */}
            {filterbyme2.map((i) => {
              if ((i as PlaceholderItem).placeholder === "YES") {
                const pi = i as PlaceholderItem;
                return (
                  <div
                    className="h-30  border grid w-full items-center justify-center text-center  " //h-120px
                    key={pi.id}
                  >
                    <div className=" font-bold">
                      {pi.shifted === 1
                        ? "Updated status to To-do"
                        : pi.shifted === 2
                          ? "Updated status to In Progress"
                          : pi.shifted === 3
                            ? "Updated status to In Review"
                            : pi.shifted === 4
                              ? "Updated status to done"
                              : ""}{" "}
                      <div className="text-[10px]">
                        To clear all placeholders, simply click the `Remove All
                        Placeholders` button located in the header.
                      </div>{" "}
                    </div>
                  </div>
                );
              }
              const ti = i as TaskWithDates;
              return (
                <div
                  key={ti.id}
                  className={`border cursor-grab grid grid-cols-1 text-center w-full  h-30 ${ti.id === dragitem?.id ? "bg-blue-300 border-10 border-blue-600" : " bg-white"}`}
                  draggable
                  onDragEnd={() => {
                    if (dragStatus.current.status === "success") {
                      setfilterbymeclone2((prev) => {
                        return prev.map((m) => {
                          if ((m as TaskWithDates).id === ti.id) {
                            return {
                              status: ti.status,
                              placeholder: "YES",
                              id: crypto.randomUUID(),
                              shifted: drop,
                            } as PlaceholderItem;
                          } else {
                            return m;
                          }
                        });
                      });
                      return;
                    }
                    setdragitem(false as any);
                  }}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData("obj", JSON.stringify(ti));
                    setdragitem(ti);
                    dragStatus.current = { status: "failed" };
                  }}
                >
                  {/*card content*/}
                  <div className=" lg:text-[18px] font-black md:text-[9px] md:w-30 md:mx-auto md:h-4  border-b lg:h-8 lg:w-60 lg:mx-auto ">
                    {" "}
                    {ti.taskno} {ti.title}
                  </div>
                  <div className="grid grid-cols-2 relative md:left-2 ">
                    <div
                      className={`text-[15px] font-bold lg:w-30 md:w-15  rounded-[10px] mx-auto   h-6  ${ti.priority === "Critical" ? "bg-red-500 text-white" : ti.priority === "Low" ? "bg-green-300 text-black" : ti.priority === "High" ? "bg-orange-400 text-black" : ti.priority === "Medium" ? "bg-yellow-300 text-black" : ""} `}
                    >
                      {ti.priority}
                    </div>
                    <div className="text-[15px] font-bold bg-blue-400 w-8.5 h-8.5 pt-1 text-white  mx-auto rounded-full relative bottom-1.5 ">
                      {ti.assignee.split(" ")[0].split("")[0] +
                        ti.assignee.split(" ")[1].split("")[0]}
                    </div>
                    <div
                      className={`lg:text-[15px] md:text-[9px] font-bold    md:relative md:right-2.5  `}
                    >
                      {ti.startDate}
                    </div>

                    <div
                      className={`lg:text-[15px] md:relative md:right-3  md:text-[9px] font-bold ${ti.priority !== "Critical" ? "" : "hidden"} `}
                    >
                      due:{ti.dueDate}
                    </div>
                    {ti.overDuedays !== null && (
                      <div className="lg:text-[15px] md:text-[9px] md:right-7 lg:w-31 lg:left-1 md:relative font-bold md:w-25 text-red-500 ">
                        {ti.overDuedays! > 7
                          ? `${ti.overDuedays} days overdue!`
                          : ti.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              height: `${filterbymeclone2.length * 120}px`,
            }}
          />
        </div>
      </div>
      {/* coulmn 3 */} {/*for detail of logic check coulmn 1 */}
      <div
        className={`lg:h-[80%] md:h-[76%]  w-full bg-slate-200 relative  ${dragover3 ? "border-blue-400 border-6" : ""}`}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();

          setdragover3(true);
          offeffectonoverifexist(3);
        }}
        onDragLeave={() => setdragover3(false)}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          handledrop3(e);
        }}
      >
        {dragover3 && (
          <div className="absolute md:top-1/2 md:left-[30%] lg:top-1/3 lg:left-[40%] text-[100px] z-1 text-black ">
            +
          </div>
        )}

        <div className="lg:text-[30px] text-center font-bold ">
          In Review
          <div className="lg:text-[20px] font-black bg-gray-300">
            Totle:{" "}
            {
              // except placeholder
              filterbymeclone3.filter((i) => (i as TaskWithDates).assignee)
                .length
            }{" "}
          </div>
        </div>

        {filterbymeclone3.filter((o) => (o as TaskWithDates).assignee)
          .length === 0 && (
          <div className="w-[90%] border absolute md:h-[85%] lg:h-[80%]   left-3 lg:top-27 md:top-15 font-bold text-gray-500">
            <div className="h-full grid grid-cols-1 place-items-center   text-gray-500">
              <Image
                src={"myimgs/add.svg"}
                width={300}
                height={300}
                alt={"Empty image"}
                className="md:h-100 "
              />

              <p>No task found</p>
            </div>
          </div>
        )}

        <div
          className="overflow-auto absolute lg:top-27  w-[90%] left-[5%] md:top-16 md:h-[88%] lg:h-[83%] "
          ref={col3scroll}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            setscroll3((e.target as HTMLDivElement).scrollTop);
          }}
        >
          {" "}
          <div
            className={`grid grid-cols-1 w-full  gap-5 ${dragover3 ? "blur-sm" : ""} `}
            style={{
              transform: `translateY(${translateY3}px)`,
              position: "absolute",
            }}
          >
            {/*card grid ^ */}
            {filterbyme3.map((i) => {
              if ((i as PlaceholderItem).placeholder === "YES") {
                const pi = i as PlaceholderItem;
                return (
                  <div
                    className="h-30  border grid w-full items-center justify-center text-center  "
                    key={pi.id}
                  >
                    <div className=" font-bold">
                      {pi.shifted === 1
                        ? "Updated status to To-do"
                        : pi.shifted === 2
                          ? "Updated status to In Progress"
                          : pi.shifted === 3
                            ? "Updated status to In Review"
                            : pi.shifted === 4
                              ? "Updated status to done"
                              : ""}{" "}
                      <div className="text-[10px]">
                        To clear all placeholders, simply click the `Remove All
                        Placeholders` button located in the header.
                      </div>{" "}
                    </div>
                  </div>
                );
              }
              const ti = i as TaskWithDates;
              return (
                <div
                  key={ti.id}
                  className={`border cursor-grab grid grid-cols-1 text-center w-full  h-30 ${ti.id === dragitem?.id ? "bg-blue-300 border-10 border-blue-600" : " bg-white"}`}
                  draggable
                  onDragEnd={() => {
                    if (dragStatus.current.status === "success") {
                      setfilterbymeclone3((prev) => {
                        return prev.map((m) => {
                          if ((m as TaskWithDates).id === ti.id) {
                            return {
                              status: ti.status,
                              placeholder: "YES",
                              id: crypto.randomUUID(),
                              shifted: drop,
                            } as PlaceholderItem;
                          } else {
                            return m;
                          }
                        });
                      });
                      return;
                    }
                    setdragitem(false as any);
                  }}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData("obj", JSON.stringify(ti));
                    setdragitem(ti);
                    dragStatus.current = { status: "failed" };
                  }}
                >
                  {/*card content*/}
                  <div className=" lg:text-[18px] font-black md:text-[9px] md:w-30 md:mx-auto md:h-4  border-b lg:h-8 lg:w-60 lg:mx-auto ">
                    {" "}
                    {ti.taskno} {ti.title}
                  </div>
                  <div className="grid grid-cols-2 relative md:left-2 ">
                    <div
                      className={`text-[15px] font-bold lg:w-30 md:w-15  rounded-[10px] mx-auto   h-6  ${ti.priority === "Critical" ? "bg-red-500 text-white" : ti.priority === "Low" ? "bg-green-300 text-black" : ti.priority === "High" ? "bg-orange-400 text-black" : ti.priority === "Medium" ? "bg-yellow-300 text-black" : ""} `}
                    >
                      {ti.priority}
                    </div>
                    <div className="text-[15px] font-bold bg-blue-400 w-8.5 h-8.5 pt-1 text-white  mx-auto rounded-full relative bottom-1.5 ">
                      {ti.assignee.split(" ")[0].split("")[0] +
                        ti.assignee.split(" ")[1].split("")[0]}
                    </div>
                    <div
                      className={`lg:text-[15px] md:text-[9px] font-bold    md:relative md:right-2.5  `}
                    >
                      {ti.startDate}
                    </div>

                    <div
                      className={`lg:text-[15px] md:relative md:right-3  md:text-[9px] font-bold ${ti.priority !== "Critical" ? "" : "hidden"} `}
                    >
                      due:{ti.dueDate}
                    </div>
                    {ti.overDuedays !== null && (
                      <div className="lg:text-[15px] md:text-[9px] md:right-7 lg:w-31 lg:left-1 md:relative font-bold md:w-25 text-red-500 ">
                        {ti.overDuedays! > 7
                          ? `${ti.overDuedays} days overdue!`
                          : ti.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              height: `${filterbymeclone3.length * 120}px`,
            }}
          />
        </div>
      </div>
      {/* coulmn 4 */} {/*for detail of logic check coulmn 1 */}
      <div
        className={`lg:h-[80%] md:h-[76%]  w-full bg-slate-200 relative  ${dragover4 ? "border-blue-400 border-6" : ""}`}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();

          setdragover4(true);
          offeffectonoverifexist(4);
        }}
        onDragLeave={() => setdragover4(false)}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          handledrop4(e);
        }}
      >
        {dragover4 && (
          <div className="absolute md:top-1/2 md:left-[30%] lg:top-1/3 lg:left-[40%] text-[100px] z-1 text-black ">
            +
          </div>
        )}

        <div className="lg:text-[30px] text-center font-bold ">
          Done
          <div className="lg:text-[20px] font-black bg-gray-300">
            Totle:{" "}
            {
              // except placeholder
              filterbymeclone4.filter((i) => (i as TaskWithDates).assignee)
                .length
            }{" "}
          </div>
        </div>

        {filterbymeclone4.filter((o) => (o as TaskWithDates).assignee)
          .length === 0 && (
          <div className="w-[90%] border absolute md:h-[85%] lg:h-[80%]   left-3 lg:top-27 md:top-15 font-bold text-gray-500">
            <div className="h-full grid grid-cols-1 place-items-center   text-gray-500">
              <Image
                src={"myimgs/add.svg"}
                width={300}
                height={300}
                alt={"Empty image"}
                className="md:h-100 "
              />

              <p>No task found</p>
            </div>
          </div>
        )}

        <div
          ref={col4scroll}
          className="overflow-auto absolute lg:top-27  w-[90%] left-[5%] md:top-16 md:h-[88%] lg:h-[83%] "
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            setscroll4((e.target as HTMLDivElement).scrollTop);
          }}
        >
          {" "}
          <div
            className={`grid grid-cols-1 w-full  gap-5 ${dragover4 ? "blur-sm" : ""} `}
            style={{
              transform: `translateY(${translateY4}px)`,
              position: "absolute",
            }}
          >
            {/*card grid ^ */}
            {filterbyme4.map((i) => {
              if ((i as PlaceholderItem).placeholder === "YES") {
                const pi = i as PlaceholderItem;
                return (
                  <div
                    className="h-30  border grid w-full items-center justify-center text-center  "
                    key={pi.id}
                  >
                    <div className=" font-bold">
                      {pi.shifted === 1
                        ? "Updated status to To-do"
                        : pi.shifted === 2
                          ? "Updated status to In Progress"
                          : pi.shifted === 3
                            ? "Updated status to In Review"
                            : pi.shifted === 4
                              ? "Updated status to done"
                              : ""}{" "}
                      <div className="text-[10px]">
                        To clear all placeholders, simply click the `Remove All
                        Placeholders` button located in the header.
                      </div>{" "}
                    </div>
                  </div>
                );
              }
              const ti = i as TaskWithDates;
              return (
                <div
                  key={ti.id}
                  className={`border cursor-grab grid grid-cols-1 text-center w-full  h-30 ${ti.id === dragitem?.id ? "bg-blue-300 border-10 border-blue-600" : " bg-white"}`}
                  draggable
                  onDragEnd={() => {
                    if (dragStatus.current.status === "success") {
                      setfilterbymeclone4((prev) => {
                        return prev.map((m) => {
                          if ((m as TaskWithDates).id === ti.id) {
                            return {
                              status: ti.status,
                              placeholder: "YES",
                              id: crypto.randomUUID(),
                              shifted: drop,
                            } as PlaceholderItem;
                          } else {
                            return m;
                          }
                        });
                      });
                      return;
                    }
                    setdragitem(false as any);
                  }}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData("obj", JSON.stringify(ti));
                    setdragitem(ti);
                    dragStatus.current = { status: "failed" };
                  }}
                >
                  {/*card content*/}
                  <div className=" lg:text-[18px] font-black md:text-[9px] md:w-30 md:mx-auto md:h-4  border-b lg:h-8 lg:w-60 lg:mx-auto ">
                    {" "}
                    {ti.taskno} {ti.title}
                  </div>
                  <div className="grid grid-cols-2 relative md:left-2 ">
                    <div
                      className={`text-[15px] font-bold lg:w-30 md:w-15  rounded-[10px] mx-auto   h-6  ${ti.priority === "Critical" ? "bg-red-500 text-white" : ti.priority === "Low" ? "bg-green-300 text-black" : ti.priority === "High" ? "bg-orange-400 text-black" : ti.priority === "Medium" ? "bg-yellow-300 text-black" : ""} `}
                    >
                      {ti.priority}
                    </div>
                    <div className="text-[15px] font-bold bg-blue-400 w-8.5 h-8.5 pt-1 text-white  mx-auto rounded-full relative bottom-1.5 ">
                      {ti.assignee.split(" ")[0].split("")[0] +
                        ti.assignee.split(" ")[1].split("")[0]}
                    </div>
                    <div
                      className={`lg:text-[15px] md:text-[9px] font-bold    md:relative md:right-2.5  `}
                    >
                      {ti.startDate}
                    </div>

                    <div
                      className={`lg:text-[15px] md:relative md:right-3  md:text-[9px] font-bold ${ti.priority !== "Critical" ? "" : "hidden"} `}
                    >
                      due:{ti.dueDate}
                    </div>
                    {ti.overDuedays !== null && (
                      <div className="lg:text-[15px] md:text-[9px] md:right-7 lg:w-31 lg:left-1 md:relative font-bold md:w-25 text-red-500 ">
                        {ti.overDuedays! > 7
                          ? `${ti.overDuedays} days overdue!`
                          : ti.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              height: `${filterbymeclone4.length * 120}px`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Coulmn;
