import React, { useEffect, useState } from "react";

import {
  getBarcodeList,
  createBarcode,
  updateBarcode,
  deleteBarcode,
} from "../../service/barcodeService";

// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";

import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const BarcodePage = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [newBarcode, setNewBarcode] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBarcodes = async () => {
    setLoading(true);
    setError("");

    const body = {
      where: {
        isActive: true,
        isDeleted: false,
        searchText: "",
      },
      pagination: {
        sortBy: "createdAt",
        descending: true,
        rows: 5,
        page: 1,
      },
    };

    try {
      const res = await getBarcodeList(body);

      if (res.success) {
        console.log("Raw API response data:", res.data);
        setBarcodes(res.data.barcodes || []);
      } else {
        setError(res.message || "Failed to load barcodes");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error occurred while fetching barcodes");
    } finally {
      setLoading(false);
    }
  };

  // barcodemodule data add

  const handleCreateOrUpdate = async () => {
    if (!newBarcode.trim()) {
      setError("Barcode cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;

      const payload = {
        userID: 2,
        barcode: newBarcode.trim(),
        out: true,
        in: false,
        receiverID: 4,
      };

      if (editId) {
        res = await updateBarcode(editId, payload);
      } else {
        res = await createBarcode(payload);
      }

      if (res.success) {
        await fetchBarcodes();
        setNewBarcode("");
        setEditId(null);
        setError("");
      } else {
        const message =
          res.message ||
          (res.error && res.error[0] && res.error[0].message) ||
          "Operation failed.";
        setError(message);
        console.error("Create/Update error:", res);
      }
    } catch (err) {
      console.error("Create/Update API error:", err);
      setError("An error occurred while saving the barcode.");
    } finally {
      setLoading(false);
    }
  };

  // delete barcodemodule api

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this barcode?"))
      return;

    setLoading(true);
    try {
      const res = await deleteBarcode(id);
      if (res.success) {
        fetchBarcodes();
        setError("");
      } else {
        setError("Failed to delete.");
        console.error("Delete error:", res);
      }
    } catch (err) {
      console.error("Delete API error:", err);
      setError("Error deleting barcode.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setNewBarcode(item.name);
  };

  useEffect(() => {
    fetchBarcodes();
  }, []);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" mb={2}>
          Barcode Module
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          label="Barcode Name"
          value={newBarcode}
          onChange={(e) => setNewBarcode(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCreateOrUpdate}
          disabled={loading}
        >
          {editId ? "Update" : "Create"}
        </Button>
        {editId && (
          <Button
            onClick={() => {
              setEditId("");
              setNewBarcode("");
            }}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        )}

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {/* table data getlist  */}

        <ul>
          {barcodes.map((item) => (
            <li key={item._id}>
              {item.name}
              {item.image && (
                <img
                  src={item.image}
                  alt="barcode"
                  height="40"
                  style={{ marginLeft: 10 }}
                  onError={(e) => {
                    console.error("Image load failed for:", item.image);
                    e.target.style.display = "none";
                  }}
                />
              )}
              <Button onClick={() => handleEdit(item)} sx={{ ml: 2 }}>
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(item._id)}
                color="error"
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        
      </Box>
      

    </>
  );
};

export default BarcodePage;
