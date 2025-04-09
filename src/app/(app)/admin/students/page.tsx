'use client';

import UserCardItem from "@/components/app/UserCardItem";
import { Department, Level } from "@/types";

export default function AdminStudentsPage() {
	return (
		<UserCardItem
			onApprove={(id => console.log(`Approved student with ID: ${id}`))}
			onReject={(id => console.log(`Rejected student with ID: ${id}`))}
			student={{
				id: 1,
				fullName: "Some name test",
				academicNumber: "0212151241256",
				studyLevel: Level.LEVEL_4,
				department: Department.IT,
			}}
		/>
	)
}