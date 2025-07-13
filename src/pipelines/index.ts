import { MorphCloudClient } from "morphcloud";

export const createAndInitializeSnapshot = async (
  mc: MorphCloudClient,
  onUpdate: (message: string) => Promise<void>,
  vcpus: number = 2,
  memory: number = 2044,
  diskSize: number = 10000
) => {
  console.log("creating snapshot");

  await onUpdate(`📦 Starting creation of snapshot`);

  // 1: Send API request to set progress:1 (TODO)

  // 2. Snapshot creation and installation of tools
  let snapshot = await mc.snapshots.create({
    vcpus,
    memory,
    diskSize,
  });

  // 2.1: Save snapshot id to DB

  await onUpdate(
    `📦 Snapshot created with id: ${snapshot.id}, executing installation of containers`
  );

  snapshot = await snapshot.setup("apt update -y");
  await onUpdate("✅ Package lists updated");

  snapshot = await snapshot.setup("apt install -y docker.io");
  await onUpdate("🐳 Docker installed");

  snapshot = await snapshot.setup("systemctl enable docker");
  await onUpdate("⚙️ Docker service enabled");

  snapshot = await snapshot.setup("systemctl start docker");
  await onUpdate("🏃 Docker service started");

  await onUpdate("🎉 Installation of tools completed successfully");

  // pulling out the repo (as of now)
  await onUpdate("🎗️ Pulling the image");
  snapshot = await snapshot.setup(
    "docker pull roydevelops/nextjs-zconnect:latest"
  );

  await onUpdate("🎗️ Starting app");

  snapshot = await snapshot.setup(
    "docker run -d -p 80:3000 --name app roydevelops/nextjs-zconnect:latest"
  );

  await onUpdate("Running docker container");

  // 3. Download the zip file

  // 4. Build the image

  // 5. Start the container
  // -d -p 80:${PORT} --name userId

  // 6. Send a proper success response

  return snapshot;
};

export const createInstanceFromSnapshotId = async (
  mc: MorphCloudClient,
  snapshotId: string
) => {
  const instance = await mc.instances.start({
    snapshotId,
  });

  // TODO: generate a service name
  const serviceUrl = await instance.exposeHttpService(
    "hello-world-example",
    80
  );
  console.log(serviceUrl);

  return { instance, serviceUrl };
};
