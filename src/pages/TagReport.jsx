import { useRef } from "react";
import { TagsDropdown } from "../components/TagsDropdown"
import { printMoney } from "../utils";

export const TagReport = () => {
  const tagsRef = useRef(null);

  return (
    <div className="tag-report">
      <section className="tag-select mb-3">
        <h2>Select a tag:</h2>
        <TagsDropdown ref={tagsRef} isMulti={false}/>
      </section>
      <section className="balance tile no-title">
        <h2>Total Spent: <span>{ printMoney(0) }</span></h2>
      </section>
      <section className="tile pb-0">
        <h2>Transactions</h2>
      </section>
    </div>
  )
}