from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions
from google.api_core.operation import Operation
from google.api_core.exceptions import FailedPrecondition

def deploy_processor_version(project_id, location, processor_id, version_id):
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    client = documentai.DocumentProcessorServiceClient(client_options=opts)
    name = client.processor_version_path(project_id, location, processor_id, version_id)
    print(f"Implantando versão {version_id}...")
    try:
        operation = client.deploy_processor_version(name=name)
        print(operation.operation.name)
        operation.result()
        print(f"Versão {version_id} implantada.")
    except FailedPrecondition as e:
        print(e.message)

def undeploy_processor_version(project_id, location, processor_id, version_id):
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    client = documentai.DocumentProcessorServiceClient(client_options=opts)
    name = client.processor_version_path(project_id, location, processor_id, version_id)
    print(f"Finalizando implantação da versão {version_id}...")
    operation = client.undeploy_processor_version(name=name)
    operation.result()
    print(f"Versão {version_id} finalizada.")

def enviar_para_google_document_ai(project_id, location, processor_id, version_id, file_path):
    api_endpoint = f"{location}-documentai.googleapis.com"
    client_options = ClientOptions(api_endpoint=api_endpoint)
    client = documentai.DocumentProcessorServiceClient(client_options=client_options)
    name = f"projects/{project_id}/locations/{location}/processors/{processor_id}/processorVersions/{version_id}"

    if file_path.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    elif file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
        mime_type = "image/jpeg"
    elif file_path.lower().endswith('.png'):
        mime_type = "image/png"
    else:
        print(f"Tipo de arquivo não suportado: {file_path}")
        return None

    with open(file_path, "rb") as f:
        content = f.read()

    raw_document = documentai.RawDocument(content=content, mime_type=mime_type)
    request = documentai.ProcessRequest(name=name, raw_document=raw_document)
    result = client.process_document(request=request)
    print(f"Arquivo {file_path} enviado e processado pelo Document AI.")
    return result.document