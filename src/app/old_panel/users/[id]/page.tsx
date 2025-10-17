import PanelLayout from "@/components/layout/panel-layout";
import { useQuery } from "@tanstack/react-query";

export default function Page() {

    // const {} = useQuery({
    //     queryKey: ['userDetails'],
    //     queryFn: async () => {
    //         // Fetch user details logic here
    //         return {};
    //     }
    // });

    return (
        <PanelLayout entityName="Users">
            <div className="p-4">User Details Page</div>
        </PanelLayout>
    );
}