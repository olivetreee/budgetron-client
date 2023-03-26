import { useMemo } from "react";
import ReactSelectCreatable from "react-select/creatable"
import { useTags } from "../providers/TagsProvider";


export const TagsDropdown = ({ tagsRef, initialTags, isMulti }) => {
  const [{ tags }] = useTags();

  const tagOptions = useMemo(() => {
    const result = [];
    tags.forEach((tag, tagId) => {
      result.push({
        value: tagId,
        label: tag.name
      });
    });
    return result;
  }, [tags]);

  return (
    <ReactSelectCreatable
      ref={tagsRef}
      defaultValue={initialTags.map(t => ({ label: tags.get(t).name, value: t }))}
      isMulti={isMulti}
      options={tagOptions}
      styles={{
        menuList: baseStyles => ({
          ...baseStyles,
          color: "black"
        }),
        multiValueRemove: baseStyles => ({
          ...baseStyles,
          color: "black"
        }),
      }}
    />
  )
};

TagsDropdown.defaultProps = {
  initialTags: [],
  isMulti: true
};
