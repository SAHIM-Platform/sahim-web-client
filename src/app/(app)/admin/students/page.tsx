'use client';

import StudentsListing from "@/components/StudentsListing";

export default function AdminStudentsPage() {
	const handleApprove = (id: string) => {
		console.log(`Approved student with ID: ${id}`);
	};

	const handleReject = (id: string) => {
		console.log(`Rejected student with ID: ${id}`);
	};

	return (
		<StudentsListing
			onApprove={handleApprove}
			onReject={handleReject}
		/>
	);
}
