import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { Phone as PhoneIcon, Favorite as FavoriteIcon, PersonPin as PersonPinIcon } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Pagination from "../components/Pagination";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { fetchRecords, createOrUpdateRecord, deleteRecord } from "../services/api";
import { RecordType } from "../types/CommonTypes";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaginatedResponse } from "../types/CommonTypes";

// Define validation schema
const validationSchema = yup.object({
  title: yup.string().required("Title is required").max(50, "Title is too long"),
  description: yup
    .string()
    .required("Description is required")
    .max(200, "Description is too long"),
  location: yup.string().required("Location is required"),
  image: yup
    .string()
    .url("Enter a Valid URL")
    .required("Image URL is required"),
});

const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState("ambulance"); // New state for tab selection

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: 0,
      title: "",
      description: "",
      location: "",
      image: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedResponse = await fetchRecords(selectedTab,currentPage, 10);
      setRecords(data.data);
      setTotalPages(Math.ceil(data.pagination.total / 10));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: RecordType) => {
    try {
      await createOrUpdateRecord(selectedTab, formData); // Pass selected tab to API call
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset({
      id: 0,
      title: "",
      description: "",
      location: "",
      image: "",
    });
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img src={params.value} alt="Record" className="h-10" />
        ) : (
          "No Image"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setModalOpen(true);
              reset(params.row);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteRecord(selectedTab, params.id).then(() => {setCurrentPage(1);fetchData()})}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedTab]); // Fetch data when tab changes

  if (loading) return <LoadingState />;
  if (error) return <div>Error: {error}</div>;
  if (records.length === 0) return <EmptyState />;

  return (
    <Box padding={4}>
      <h1 className="text-2xl font-bold mb-4">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Records</h1>
      
      {/* Tabs component to select between Ambulance and Doctor */}
      <div className="flex justify-center" >
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} aria-label="ambulance or doctor tabs">
        <Tab icon={<PhoneIcon />} label="Ambulance" value="ambulance" />
        <Tab icon={<FavoriteIcon />} label="Doctor" value="doctor" />
      </Tabs>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add {selectedTab}
      </Button>
      
      <DataGrid
        rows={records}
        columns={columns}
        autoHeight
        disableSelectionOnClick
        paginationMode="server"
        hideFooterPagination
        loading={loading}
      />
      
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add/Edit {selectedTab} Record</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  error={!!errors.image}
                  helperText={errors.image?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default Dashboard;
