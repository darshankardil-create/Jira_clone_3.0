"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Activity } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FourCoulmns from "./component/coulmn";

// (code) is to find by search inter-dependent or related code lines

const Page = () => {
  interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    taskno: number;
  }

  interface PlaceholderItem {
    status: string;
    placeholder: string;
    id: string;
    shifted: number;
  }

  interface TaskWithDates extends Task {
    dueDate: string;
    startDate: string;
    overDuedays: number | null;
  }

  type ColumnItem = TaskWithDates | PlaceholderItem;

  const [hidepriorityfilter, sethidepriorityfilter] = useState<boolean>(false);
  const [hideassigneefilter, sethideassigneefilter] = useState<boolean>(false);
  const [hidestatusfilter, sethidestatusfilter] = useState<boolean>(false);

  //date

  const [date1, setdate1] = useState<string | null>(null);
  const [date2, setdate2] = useState<string | null>(null);

  const [betweenDates, setbetweenDates] = useState<string[]>([]);

  const users: string[] = [
    "Darshan Kardile",
    "Elon Musk",
    "Bill Gates",
    "Nikola Tesla",
    "Steve Jobs",
    "Jeff Bezos",
  ];

  const statuses: string[] = ["To Do", "In Progress", "In Review", "Done"];

  function generateTasks(count: number): Task[] {
    const priorities: string[] = ["Low", "Medium", "High", "Critical"];

    const titles: string[] = [
      "Fix Bug",
      "Update UI",
      "Design Feature",
      "Test Functionality",
      "Optimize Code",
      "Write Docs",
    ];

    const store: Task[] = [];

    for (let i = 0; i < count; i++) {
      store.push({
        id: crypto.randomUUID(),
        title: titles[Math.floor(Math.random() * 6)],
        status: statuses[Math.floor(Math.random() * 4)],
        priority: priorities[Math.floor(Math.random() * 4)],
        assignee: users[Math.floor(Math.random() * 6)],
        taskno: i,
      });
    }

    return store;
  }

  function run(): TaskWithDates[] {
    // assign dueDate startDate overDueDays on basis of priority

    const finaldata = generateTasks(500).map((i) => {
      let dueDate: Date;
      let startDate: Date;
      let overDuedays: number = 0;

      if (i.priority === "Critical") {
        const overdueDays = Math.floor(Math.random() * 21) + 1; //1 to 20 before from curr

        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() - overdueDays);

        startDate = new Date(dueDate);
        startDate.setDate(
          dueDate.getDate() - (Math.floor(Math.random() * 5) + 1), // this subtracts days
        );

        overDuedays = overdueDays;
      } else if (i.priority === "High") {
        const duedaysfromcurr = Math.floor(Math.random() * 300) + 1; // 1 - 300

        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + duedaysfromcurr);

        startDate = new Date(dueDate);
        const startbeforefromduedays = Math.floor(Math.random() * 4) + 1;

        startDate.setDate(dueDate.getDate() - startbeforefromduedays);
      } else if (i.priority === "Medium") {
        const days = Math.floor(Math.random() * 100) + 1;

        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        startDate = new Date(dueDate);
        const startdaysbeforedue = Math.floor(Math.random() * 5) + 1;
        startDate.setDate(dueDate.getDate() - startdaysbeforedue);
      } else {
        const days = Math.floor(Math.random() * 300) + 1;

        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        startDate = new Date(dueDate);
        startDate.setDate(
          dueDate.getDate() - (Math.floor(Math.random() * 9) + 1),
        );
      }

      return {
        ...i,
        dueDate: dueDate!.toLocaleDateString("en-CA"), // YYYY-MM-DD
        startDate: startDate!.toLocaleDateString("en-CA"),
        overDuedays: overDuedays || null,
      };
    });

    return finaldata;
  }

  const [filterbymeclone1, setfilterbymeclone1] = useState<ColumnItem[]>([]);
  const [filterbymeclone2, setfilterbymeclone2] = useState<ColumnItem[]>([]);
  const [filterbymeclone3, setfilterbymeclone3] = useState<ColumnItem[]>([]);
  const [filterbymeclone4, setfilterbymeclone4] = useState<ColumnItem[]>([]);

  //root data state
  const [data, setdata] = useState<TaskWithDates[]>(() => run());

  useEffect(() => {
    // date is main root of data

    function setdataforcoulmn() {
      const todoData = data.filter((o) => o.status === "To Do");

      //coulme 1

      setfilterbymeclone1(todoData);

      const inProgressData = data.filter((o) => o.status === "In Progress");

      //coulme 2

      setfilterbymeclone2(inProgressData);

      const InReviewData = data.filter((o) => o.status === "In Review");

      //coulme 3

      setfilterbymeclone3(InReviewData);

      const DoneData = data.filter((o) => o.status === "Done");

      //coulme 4

      setfilterbymeclone4(DoneData);
    }

    setdataforcoulmn();
  }, [data]);

  const prioritiyfilterselect: string[] = [
    "All",
    "Low",
    "Medium",
    "High",
    "Critical",
  ];

  const [dataclone, setdataclone] = useState<TaskWithDates[]>(() => run());

  function getbetweentwodates(start: Date, end: Date): Date[] {
    const arr: Date[] = [];

    while (start < end) {
      const startDate = new Date(start);

      start.setDate(start.getDate() + 1);

      arr.push(startDate);
    }

    return arr;
  }

  useEffect(() => {
    // due date filter handler
    function a() {
      const startDate = new Date(date1!);
      const endDate = new Date(date2!);

      setbetweenDates(
        getbetweentwodates(startDate, endDate).map((i) =>
          i.toLocaleDateString("en-CA"),
        ),
      );
    }

    a();
  }, [date1, date2]);

  //filters

  const [priorityfilter, setpriorityfilter] = useState<string[]>([]);
  const [assigneefilter, setassigneefilter] = useState<string[]>([]);
  const [statusfilter, setstatusfilter] = useState<string[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    //sharabler filter url logic

    const assignF = searchParams.get("a");
    const priorityF = searchParams.get("p");
    const statusF = searchParams.get("s");
    const strandend: (string | null)[] =
      JSON.parse(searchParams.get("b") ?? "null") ?? [];

    function setter() {
      if (strandend[1]) {
        const str = new Date(strandend[0] ?? "");
        const end = new Date(strandend[1] ?? "");

        setdate1(str.toLocaleDateString("en-CA"));
        setdate2(end.toLocaleDateString("en-CA"));

        const betweendates = getbetweentwodates(str, end).map((i) =>
          i.toLocaleDateString("en-CA"),
        );

        setbetweenDates(betweendates ?? []);
      }

      setassigneefilter(JSON.parse(assignF!) ?? []);
      setpriorityfilter(JSON.parse(priorityF!) ?? []);
      setstatusfilter(JSON.parse(statusF!) ?? []);
    }

    setter();
  }, []);

  // Filtering Logic

  const router = useRouter();

  useEffect(() => {
    function Filters() {
      setdata(() => {
        return dataclone.filter((o) => {
          const P =
            priorityfilter.length === 0 || //allow all priority if true
            priorityfilter.includes("All") || //allow all priority if true
            priorityfilter.includes(o.priority);

          const A =
            assigneefilter.length === 0 || assigneefilter.includes(o.assignee);
          const B =
            betweenDates.length === 0 || betweenDates.includes(o.dueDate);

          const S =
            statusfilter.includes(o.status) || statusfilter.length === 0;

          return A && P && B && S;
        });
      });
    }
    Filters();
    router.push(
      `?a=${JSON.stringify(assigneefilter)}&p=${JSON.stringify(priorityfilter)}&b=${JSON.stringify([date1, date2])}&s=${JSON.stringify(statusfilter)}`,
    );
  }, [
    assigneefilter,
    priorityfilter,
    betweenDates,
    date1,
    date2,
    statusfilter,
  ]); // dataclone and data gets data as initial value in

  return (
    <div
      //close on click outside
      onClick={() => {
        if (hidepriorityfilter) {
          sethidepriorityfilter(false);
        } else if (hideassigneefilter) {
          sethideassigneefilter(false);
        } else if (hidestatusfilter) {
          sethidestatusfilter(false);
        }
      }}
    >
      <div className="h-screen w-screen bg-amber-100 grid grid-cols-4 gap-10 place-items-center pl-10 pr-10  ">
        <div className="fixed bg-[#075de7] top-0 w-full h-[8%] z-1 flex items-center justify-center gap-5">
          <button
            className={`cursor-pointer bg-amber-400 md:text-[10px]  font-bold lg:text-sm  w-40 h-10 rounded-md ml-2 ${filterbymeclone1.filter((o) => (o as PlaceholderItem).placeholder === "YES").length + filterbymeclone2.filter((o) => (o as PlaceholderItem).placeholder === "YES").length + filterbymeclone3.filter((o) => (o as PlaceholderItem).placeholder === "YES").length + filterbymeclone4.filter((o) => (o as PlaceholderItem).placeholder === "YES").length > 0 ? "outline-5 outline-green-400" : ""}`}
            onClick={() => {
              setfilterbymeclone1((prev) =>
                prev.filter(
                  (o) => (o as PlaceholderItem).placeholder !== "YES", //coulm 1
                ),
              );
              setfilterbymeclone2((prev) =>
                prev.filter(
                  (o) => (o as PlaceholderItem).placeholder !== "YES", //coulm 2
                ),
              );
              setfilterbymeclone3((prev) =>
                prev.filter(
                  (o) => (o as PlaceholderItem).placeholder !== "YES", //coulm 3
                ),
              );
              setfilterbymeclone4((prev) =>
                prev.filter(
                  (o) => (o as PlaceholderItem).placeholder !== "YES", //coulm 4
                ),
              );
            }}
          >
            Remove all placeholder
          </button>

          <button
            className={`cursor-pointer bg-amber-400  font-bold w-60 h-10 rounded-md md:text-[10px] lg:text-base  ${priorityfilter.length > 0 ? "outline-5 outline-green-400" : ""}`}
            onClick={() => sethidepriorityfilter(true)}
          >
            Apply filter for priority
          </button>

          <button
            className={`cursor-pointer bg-amber-400  font-bold w-60 h-10 md:text-[10px] lg:text-base rounded-md ${assigneefilter.length > 0 ? "outline-5 outline-green-400" : ""}`}
            onClick={() => sethideassigneefilter(true)}
          >
            Apply filter for assignee
          </button>

          <button
            className={`cursor-pointer bg-amber-400  font-bold w-60 h-10 md:text-[10px] lg:text-base rounded-md ${statusfilter.length > 0 ? "outline-5 outline-green-400" : ""}`}
            onClick={() => sethidestatusfilter(true)}
          >
            Apply filter for status
          </button>

          <div
            className={`lg:w-85 md:w-60  relative rounded-md ${betweenDates.length ? "outline-5 outline-green-400" : ""}  border-gray-300  flex gap-3  border-2 items-end justify-center pb-1  h-[90%]    `}
          >
            <div className="absolute top-0 font-black text-amber-300 md:text-[11px] text-center lg:text-sm  w-full">
              <div>Select range for due date</div>
            </div>

            <input
              className="h-7 text-white  border-3 rounded-md font-black md:text-[10px] lg:text-base  "
              type="date"
              value={date1 ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setdate1(e.target.value)
              }
            />

            <div className="text-white font-black">To</div>

            <input
              className="h-7 text-white border-3 rounded-md font-black md:text-[10px] lg:text-base"
              type="date"
              min={date1!}
              value={date2 ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!date1) {
                  alert("You must select start date first");
                  return;
                }

                setdate2(e.target.value);
              }}
            />
          </div>

          <button
            className={`cursor-pointer bg-red-500 text-white font-black  w-35 h-10 md:text-[10px] lg:text-base rounded-md  mr-2`}
            onClick={() => {
              const C = confirm("This action will clear all applied filters.");

              if (!C) return;

              setpriorityfilter([]);
              setstatusfilter([]);
              setassigneefilter([]);
              setbetweenDates([]);
              setdate1(null);
              setdate2(null);
            }}
          >
            Clear all filters
          </button>
        </div>
        <div className={"grid  absolute justify-items-center top-[9%] "}>
          <Activity mode={hideassigneefilter ? "visible" : "hidden"}>
            <div
              className="w-50 h-60 z-2   bg-[#08d5f0d8]  absolute top-[9%]    rounded-lg  "
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <div className="grid gap-4 grid-cols-1 h-53 overflow-y-auto  [&::-webkit-scrollbar]:hidden  relative top-3 left-3.5   ">
                {users.map((i, ind) => {
                  return (
                    <div
                      className={`font-black grid grid-cols-2 gap-30 border-b w-44 ${assigneefilter.includes(i) ? "bg-[#11b3c8d8] p-1" : ""} `}
                      key={ind}
                    >
                      <label
                        htmlFor={`assigneefilter ${ind}`}
                        className="w-43 cursor-pointer hover:bg-[#18bbd1d8]"
                      >
                        {i}
                      </label>
                      <input
                        id={`assigneefilter ${ind}`}
                        checked={assigneefilter.includes(i)}
                        className={"w-5 h-5 cursor-pointer "}
                        type={"checkbox"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setassigneefilter((prev) => [...prev, i]); //first add to array on checked action then control input (code:a2)
                            // will check whether added or not if added it checks the checkbox otherwise not
                          } else {
                            setassigneefilter(
                              (prev) => prev.filter((o) => o !== i), //removed on un-checked from array
                            );
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Activity>

          <Activity mode={hidestatusfilter ? "visible" : "hidden"}>
            <div
              className="w-50 h-60 z-2   bg-[#08d5f0d8]  absolute top-[9%]    rounded-lg  "
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <div className="grid gap-4 grid-cols-1 h-53 overflow-y-auto  [&::-webkit-scrollbar]:hidden  relative top-3 left-3.5   ">
                {statuses.map((i, ind) => {
                  return (
                    <div
                      className={`font-black grid grid-cols-2 gap-30 border-b w-44 ${statusfilter.includes(i) ? "bg-[#11b3c8d8] p-1" : ""} `}
                      key={ind}
                    >
                      <label
                        htmlFor={`statusfilter ${ind}`}
                        className="w-43 cursor-pointer hover:bg-[#18bbd1d8]"
                      >
                        {i}
                      </label>
                      <input
                        id={`statusfilter ${ind}`}
                        checked={statusfilter.includes(i)}
                        className={"w-5 h-5 cursor-pointer "}
                        type={"checkbox"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setstatusfilter((prev) => [...prev, i]); // code:a2
                          } else {
                            setstatusfilter((prev) =>
                              prev.filter((o) => o !== i),
                            );
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Activity>

          <Activity mode={hidepriorityfilter ? "visible" : "hidden"}>
            <div
              className="w-90 h-22 z-2 color  bg-[#08d5f0e9]   absolute  top-[9%] rounded-lg "
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <div className="grid gap-4 grid-cols-3 relative top-3 left-5">
                {prioritiyfilterselect.map((i, ind) => {
                  return (
                    <div
                      className="font-black grid grid-cols-2 gap-4"
                      key={ind}
                    >
                      <label
                        htmlFor={`priorityfilter ${ind}`}
                        className="cursor-pointer "
                      >
                        {i}
                      </label>
                      <input
                        className="w-5 h-5 cursor-pointer "
                        id={`priorityfilter ${ind}`}
                        type={"checkbox"}
                        checked={priorityfilter.includes(i)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setpriorityfilter((prev) => [...prev, i]); // code:a2
                          } else {
                            setpriorityfilter((prev) =>
                              prev.filter((o) => o !== i),
                            );
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Activity>
        </div>
        <FourCoulmns
          filterbymeclone1={filterbymeclone1}
          filterbymeclone2={filterbymeclone2}
          filterbymeclone3={filterbymeclone3}
          filterbymeclone4={filterbymeclone4}
          setfilterbymeclone1={setfilterbymeclone1}
          setfilterbymeclone2={setfilterbymeclone2}
          setfilterbymeclone3={setfilterbymeclone3}
          setfilterbymeclone4={setfilterbymeclone4}
        />
      </div>
    </div>
  );
};

export default Page;
