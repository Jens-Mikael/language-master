"use client";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState } from "react";
import { getData } from "@/data";

const QueryTest = () => {
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["string"], getData);

  const mutate = useMutation(
    (text) => {
      const newData = text;
      //queryClient.setQueryData(["string"], newData);
      return newData;
    },
    {
      onMutate: (updatedText) => {
        // Store the previous data before the mutation
        const previousData = queryClient.getQueryData(["string"]);
        // Return the previous data to be used in the rollback function
        return previousData;
      },
      onError: (error, variables, context) => {
        // If the mutation fails, roll back the data to the previous state
        console.log(error);
        console.log(variables);
        queryClient.setQueryData(["string"], context);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["string"]);
      },
    }
  );

  const handleSubmit = async () => {
    await mutate.mutateAsync(text);
    setText("");
  };
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="text-3xl">
      {data}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>click to edit</button>
    </div>
  );
};

export default QueryTest;
