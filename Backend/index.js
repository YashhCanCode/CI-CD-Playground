const PIPELINE_STATUS = {
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};

const STAGE_STATUS = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED"
};



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getStage(pipeline, name) {
  return pipeline.stages.find(stage => stage.name === name);
}


const pipelines = new Map();

function createPipeline(failTest = false) {
  return {
    runId: Date.now().toString(),
    status: "RUNNING",
    failTest,
    stages: [
      { name: "BUILD", status: "PENDING", logs: [] },
      { name: "TEST", status: "PENDING", logs: [] },
      { name: "DEPLOY", status: "PENDING", logs: [] }
    ]
  };
}

async function runPipeline(pipeline) {
  const build = getStage(pipeline, "BUILD");
  const test = getStage(pipeline, "TEST");
  const deploy = getStage(pipeline, "DEPLOY");

  // BUILD
  build.status = STAGE_STATUS.RUNNING;
  build.logs.push("Starting build...");
  await delay(3000);
  build.logs.push("Build completed successfully");
  build.status = STAGE_STATUS.SUCCESS;

  // TEST
  test.status = STAGE_STATUS.RUNNING;
  test.logs.push("Running tests...");
  await delay(3000);

  if (pipeline.failTest) {
    test.logs.push("Tests failed ❌");
    test.status = STAGE_STATUS.FAILED;

    deploy.status = STAGE_STATUS.SKIPPED;
    deploy.logs.push("Skipped due to test failure");

    pipeline.status = PIPELINE_STATUS.FAILED;
    return;
  }

  test.logs.push("All tests passed");
  test.status = STAGE_STATUS.SUCCESS;

  // DEPLOY
  deploy.status = STAGE_STATUS.RUNNING;
  deploy.logs.push("Deploying application...");
  await delay(3000);
  deploy.logs.push("Deployment successful");
  deploy.status = STAGE_STATUS.SUCCESS;

  pipeline.status = PIPELINE_STATUS.SUCCESS;
}

async function retryTestStage(pipeline) {
  pipeline.status = PIPELINE_STATUS.RUNNING;

  const test = getStage(pipeline, "TEST");
  const deploy = getStage(pipeline, "DEPLOY");

  test.status = STAGE_STATUS.PENDING;
  test.logs = [];
  deploy.status = STAGE_STATUS.PENDING;
  deploy.logs = [];

  test.status = STAGE_STATUS.RUNNING;
  test.logs.push("Retrying tests...");
  await delay(3000);

  test.logs.push("Tests passed on retry");
  test.status = STAGE_STATUS.SUCCESS;

  deploy.status = STAGE_STATUS.RUNNING;
  deploy.logs.push("Deploying application...");
  await delay(3000);
  deploy.logs.push("Deployment successful");
  deploy.status = STAGE_STATUS.SUCCESS;

  pipeline.status = PIPELINE_STATUS.SUCCESS;
}



const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/pipeline/run", (req, res) => {
  const { failTest } = req.body || {};
  const pipeline = createPipeline(failTest);
  pipelines.set(pipeline.runId, pipeline);
  runPipeline(pipeline);
  res.json({ runId: pipeline.runId });
});

app.post("/pipeline/:id/retry", (req, res) => {
  const pipeline = pipelines.get(req.params.id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  if (pipeline.status !== "FAILED") {
    return res.status(400).json({ error: "Pipeline is not failed" });
  }

  retryTestStage(pipeline);
  res.json({ message: "Retry started" });
});

app.get("/pipeline/:id", (req, res) => {
  const pipeline = pipelines.get(req.params.id);

  if (!pipeline) {
    return res.status(404).json({ error: "Pipeline not found" });
  }

  res.json(pipeline);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});