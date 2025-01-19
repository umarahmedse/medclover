import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorSelectProps {
  doctors: { [key: string]: { name: string; id: string }[] };
  loading: boolean;
  selectedDoctor: string;
  onSelect: (value: string) => void;
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({ doctors, loading, selectedDoctor, onSelect }) => {
  return (
    <div>
      <label>Select Doctor</label>
      {loading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <Select value={selectedDoctor} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Doctor" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(doctors).map(([specialization, doctorList]) => (
              <SelectGroup key={Math.random()}>
                <SelectLabel>{specialization}</SelectLabel>
                {doctorList.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default DoctorSelect;
