'use client';

import StudentsListing from "@/components/StudentsListing";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";

export default function AdminStudentsPage() {

	useAdminRoleGuard();

	return (
		<StudentsListing />
	);
}
