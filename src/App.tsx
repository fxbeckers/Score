import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import ScienceIcon from "@mui/icons-material/Science";

const LineItem: React.FC = ({ children }) => {
  return <Box display="flex" justifyContent="space-between" p={1}>{children}</Box>;
};

type FormValues = {
  age: number;
  gender: number;
  surgical_indication: number;
  asa_score: number;
  treated_hta: number;
  preop_emoglobin: number;
};

const ControlledSelect: React.FC<{
  field: keyof FormValues;
  label: string;
  options: { label: string; value: any }[];
}> = ({ field, label, options }) => {
  return (
    <Controller
      name={field}
      defaultValue={""}
      rules={{ required: true }}
      render={({ field }) => (
        <LineItem>
          <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              label={label}
            >
              {options.map((opt) => {
                return (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </LineItem>
      )}
    />
  );
};

const ControlledInput: React.FC<{
  field: keyof FormValues;
  label: string;
}> = ({ field, label }) => {
  return (
    <Controller
      name={field}
      defaultValue={""}
      rules={{ required: true }}
      render={({ field }) => (
        <LineItem>
          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={label}
            type="number"
            variant="outlined"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </LineItem>
      )}
    />
  );
};

function App() {
  const methods = useForm<FormValues>({defaultValues:{
    age:'',
    asa_score:'',
    gender:'',
    preop_emoglobin:'',
    surgical_indication:'',
    treated_hta:''
  } as any});
  const [score, setScore] = useState<number | null>(null);
  const onSubmit = (data: FormValues) => {
    const score =
      2.503 +
      0.0506 * data.age -
      2.896 * data.gender +
      2.976 * data.surgical_indication +
      0.733 * data.asa_score +
      0.771 * data.treated_hta -
      0.97 * data.preop_emoglobin;
    const roundedScore = Math.round(score * 10000) / 10000;
    setScore(roundedScore);
  };
  const reset = () => {
    methods.reset();
    setScore(null);
  }

  const doBloodDraw = !!score && score > -4.5676;
  const resultLabel = doBloodDraw  ? `Pas faire prise de sang` : `Faire prise de sang`;
  const resultIcon = doBloodDraw ? <ScienceIcon /> : <DoNotTouchIcon />;

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Beckers score
          </Typography>
        </Toolbar>
      </AppBar>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <ControlledInput field="age" label="Age" />
              <ControlledSelect
                field="gender"
                label="Gender"
                options={[
                  { label: "Male", value: 1 },
                  { label: "Female", value: 0 },
                ]}
              />
              <ControlledSelect
                field="surgical_indication"
                label="Surgical Indication"
                options={[
                  { label: "Osteonecrosis", value: 1 },
                  { label: "Arthritis", value: 0 },
                ]}
              />
              <ControlledSelect
                field="asa_score"
                label="ASA Score"
                options={[
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 },
                  { label: "4", value: 4 },
                ]}
              />
              <ControlledSelect
                field="treated_hta"
                label="Treated HTA"
                options={[
                  { label: "Yes", value: 1 },
                  { label: "No", value: 0 },
                ]}
              />
              <ControlledInput
                field="preop_emoglobin"
                label="Preop hemoglobin (g/dl)"
              />
              <LineItem>
                <Button type="submit" variant="contained">
                  Calculate Score
                </Button>
                <Button color="error" onClick={reset} variant="contained">
                  Reset
                </Button>
              </LineItem>
              <LineItem>
                {!!score ? (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                    >
                      <Box>
                        {resultIcon}
                      </Box>
                      <Box>Score: {score}</Box>
                      <Box>{resultLabel}</Box>
                    </Stack>
                  ) : null}
              </LineItem>
            </Paper>
          </Container>
        </form>
      </FormProvider>
    </React.Fragment>
  );
}

export default App;
