// src/components/gopa/RequestList.tsx
import React from "react";
import RequestCard from "./RequestCard";
import { Inbox } from "lucide-react";

interface Props {
  requests: any[];
}

const RequestList: React.FC<Props> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
            <Inbox className="h-6 w-6 text-blue" />
          </div>
          <p className="text-sm font-medium text-dark mb-1">
            No requests found
          </p>
          <p className="text-sm text-dark-4">
            There are no requests to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => (
        <RequestCard key={req.request_id} request={req} />
      ))}
    </div>
  );
};

export default RequestList;
