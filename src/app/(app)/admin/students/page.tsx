'use client';

import StudentsListing from "@/components/StudentsListing";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";

export default function AdminStudentsPage() {

	useAdminRoleGuard();

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
